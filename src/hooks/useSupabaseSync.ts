import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { toDB, logError } from '../lib/utils';

type SyncOptions = {
  /** 记录的主键 ID，默认为 `current-{tableName}` */
  id?: string;
  /** 包含 user_id 的对象，或直接传 user_id 字符串 */
  userId?: string;
  /** 如果设置，upsert 后清理不在当前数据中的记录（按此字段匹配） */
  idField?: string;
  /** 当前记录的 idField 值列表（用于 stale cleanup） */
  currentIds?: string[];
  /** 额外的记录 ID（如 task 内部的 task id） */
  extraIds?: string[];
};

export function useSupabaseSync<T>(
  tableName: string,
  data: T,
  options: SyncOptions = {}
) {
  const prevRef = useRef<string>('');

  useEffect(() => {
    if (!options.userId) return;

    const serialized = JSON.stringify(data);
    if (serialized === prevRef.current) return;
    prevRef.current = serialized;

    const recordId = options.id || `current-${tableName}`;
    const isArray = Array.isArray(data);

    let dbData: Record<string, unknown>;

    if (isArray) {
      const items = (data as unknown[]).map(item =>
        toDB({ ...(item as Record<string, unknown>), user_id: options.userId })
      );
      dbData = toDB({ id: recordId, user_id: options.userId, items });
      // For arrays, upsert each item individually
      supabase
        .from(tableName)
        .upsert(items)
        .then(() => {
          if (options.idField) {
            const allIds = [...(options.currentIds || []), ...(options.extraIds || [])];
            const del = supabase.from(tableName).delete().eq('user_id', options.userId);
            (allIds.length > 0 ? del.not(options.idField, 'in', `(${allIds.join(',')})`) : del)
              .then(null, logError(`cleaning up ${tableName}`));
          }
        })
        .then(null, logError(`saving ${tableName}`));
    } else {
      dbData = toDB({ id: recordId, user_id: options.userId, ...(data as Record<string, unknown>) });
      supabase
        .from(tableName)
        .upsert(dbData)
        .then(null, logError(`saving ${tableName}`));
    }
  }, [data, options.userId]);
}
