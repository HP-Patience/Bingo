import { useEffect, useRef, useCallback } from 'react';
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
  const dataRef = useRef(data);
  const optionsRef = useRef(options);
  dataRef.current = data;
  optionsRef.current = options;

  const doSync = useCallback((data: T, opts: SyncOptions) => {
    if (!opts.userId) return Promise.resolve();

    const recordId = opts.id || `current-${tableName}`;
    const isArray = Array.isArray(data);

    if (isArray) {
      const items = (data as unknown[]).map(item =>
        toDB({ ...(item as Record<string, unknown>), user_id: opts.userId })
      );
      return supabase
        .from(tableName)
        .upsert(items)
        .then(() => {
          if (opts.idField && opts.currentIds !== undefined) {
            const allIds = [...opts.currentIds, ...(opts.extraIds || [])];
            let query = supabase.from(tableName).delete().eq('user_id', opts.userId);
            if (allIds.length > 0) {
              query = query.not(opts.idField, 'in', `(${allIds.join(',')})`);
            }
            return query.then(null, logError(`cleaning up ${tableName}`));
          }
        })
        .then(null, logError(`saving ${tableName}`));
    } else {
      const dbData = toDB({ id: recordId, user_id: opts.userId, ...(data as Record<string, unknown>) });
      return supabase
        .from(tableName)
        .upsert(dbData)
        .then(null, logError(`saving ${tableName}`));
    }
  }, [tableName]);

  const flush = useCallback(() => {
    const currentData = dataRef.current;
    const currentOpts = optionsRef.current;
    if (!currentOpts.userId) return Promise.resolve();
    const serialized = JSON.stringify(currentData);
    if (serialized === prevRef.current) return Promise.resolve();
    prevRef.current = serialized;
    return doSync(currentData, currentOpts);
  }, [doSync]);

  useEffect(() => {
    if (!options.userId) return;

    const serialized = JSON.stringify(data);
    if (serialized === prevRef.current) return;
    prevRef.current = serialized;

    doSync(data, options);
  }, [data, options.userId]);

  return { flush };
}
