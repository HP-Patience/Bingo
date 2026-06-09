# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Life Bingo — 基于 React 的宾果游戏式任务管理应用。通过完成任务获得 XP、提升等级、抽奖和购买虚拟商品来激励日常行动。定位为 ADHD 友好型生产力工具。

## 常用命令

```bash
npm install              # 安装依赖
npm run dev              # 开发服务器 (port 5173, host 0.0.0.0)
npm run build            # 生产构建
npm run preview          # 预览生产构建
npm run lint             # TypeScript 类型检查 (tsc --noEmit)
npm run clean            # 删除 dist 目录
```

## 环境变量

复制 `.env.example` 为 `.env.local`（注意：`.env.example` 仅含 `APP_URL`，实际需要以下变量）：

- `VITE_SUPABASE_URL` — Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY` — Supabase 匿名密钥
- `VITE_SITE_URL` — 生产环境 URL，用于邮箱验证重定向

## 架构

### 分层结构

```
App.tsx (~1000 行)          ← 应用外壳：组装 hooks + 渲染视图
  ├── hooks/ (9 个)         ← 领域逻辑层：状态管理 + Supabase 同步
  └── components/ (30 个)   ← UI 层：纯视图组件
```

**App.tsx** 是根组件，通过自定义 hooks 管理所有状态，根据 `activeTab` 渲染对应视图。视图切换由 Layout 组件中的底部导航栏驱动。

### Hooks（领域逻辑层）

每个 hook 封装一个业务领域的状态和副作用：

| Hook | 职责 |
|------|------|
| `useAuth` | Supabase Auth 认证（登录/注册/登出/会话恢复） |
| `useSettings` | 主题 (theme)、单元格详情 (showCellDetails) 等显示设置 |
| `useTasks` | 任务组 CRUD、任务增删改 |
| `useBingo` | 宾果棋盘状态、尺寸切换 (3x3~6x6)、随机填充、完成判定、shuffle、tile note |
| `useHistory` | 历史记录读写、编辑/删除已完成任务 |
| `useGacha` | 抽奖逻辑：次数计算、抽卡、保底、历史 |
| `useShop` | 商店购买、余额管理、购买历史 |
| `useAchievements` | 成就解锁检测与记录 |
| `useSupabaseSync` | 通用 Supabase 数据同步（泛型 hook，自动序列化+upsert） |

**重要模式：** `useSupabaseSync` 是一个泛型 hook，当状态变化时会自动执行 upsert 到 Supabase。所有数据修改只需更新本地状态，同步自动发生。

### 核心文件

| 文件 | 用途 |
|------|------|
| `src/App.tsx` | 根组件，组装所有 hooks，按 `activeTab` 条件渲染对应视图 |
| `src/types.ts` | 所有 TypeScript 类型定义（Task, BingoTile, User, Settings 等） |
| `src/constants.ts` | 初始数据（任务池、宾果棋盘、成就、商店物品、抽奖池）及游戏配置 |
| `src/lib/gameLogic.ts` | `calculateXP()`、`XP_PER_LEVEL`、`getTitleForLevel()`、`getNextLevelXp()` |
| `src/lib/utils.ts` | `cn()`（clsx + tailwind-merge）、`toDB()`/`fromDB()` 序列化 |
| `src/lib/supabase.ts` | Supabase 客户端初始化 + 头像上传 (Supabase Storage) + base64 迁移 |
| `src/gachaUtils.ts` | 抽奖系统纯函数：奖池选择、奖励抽取、保底机制 |
| `src/index.css` | Tailwind 指令 + CSS 自定义属性主题变量（zinc 和 dark 两种主题） |
| `bingo.sql` | Supabase 数据库建表语句（含迁移示例） |

### 数据流

```
用户操作 → Hook (状态更新) → useSupabaseSync (自动持久化到 Supabase)
                ↓
          组件重渲染 (UI 更新)
```

- 认证通过 Supabase Auth `onAuthStateChange` 监听器保持登录状态
- 数据修改后通过 `useSupabaseSync` 自动同步到 Supabase，无需手动保存
- 如需向数据库添加新字段，需同时修改 `src/types.ts` 类型定义 + 在 Supabase SQL Editor 执行 `ALTER TABLE`

### 主题系统

2 种主题（zinc 浅色 / dark 深色），通过 `data-theme` 属性 + CSS 自定义属性实现。主题和显示设置存储在 Supabase settings 表中。

新增设置项的流程：
1. `src/types.ts` 的 `Settings` 类型中加字段
2. `src/constants.ts` 的 `INITIAL_SETTINGS` 加默认值
3. `bingo.sql` 加迁移 `ALTER TABLE settings ADD COLUMN ...`
4. 在 Supabase Dashboard SQL Editor 执行 ALTER TABLE

### XP 与等级

`calculateXP(difficulty, priority)`：基础值 easy=10, medium=20, hard=30，优先级加成 low=0, medium=5, high=10。

`XP_PER_LEVEL = 200`：每级统一 200 XP。`getTitleForLevel(level)` 返回等级称号（10/20/30/40/50 级解锁不同头衔），`getNextLevelXp()` 返回下一级所需 XP（恒为 200）。

### 抽奖系统

4 个等级奖池，概率表在 `constants.ts` 中定义。保底机制：连续 3 次低奖励后保底稀有以上；连续 5 次相同类型后强制切换类型。每升一级获得抽奖次数（低等级 1 次/级，高等级 2 次/级）。

### 技术栈

React 19, Vite 6, TypeScript 5.8, Tailwind CSS 3.4, Supabase, Lucide React (图标), Motion (动画), Recharts (图表)

## 注意事项

- **新增功能遵循 hook 驱动模式**：在 `hooks/` 中新建 hook 管理状态和副作用，在 `components/` 中新建组件渲染 UI。
- **没有测试套件**。lint 仅做类型检查（`tsc --noEmit`）。
- `@` 路径别名指向项目根目录（`./*`）。
- HMR 可通过 `DISABLE_HMR` 环境变量禁用（AI Studio 使用）。
- 该应用已部署到 Vercel：https://bingo.vercel.app
- **Supabase 数据库结构变更**：改了 `src/types.ts` 后，检查 `bingo.sql` 是否需同步更新，并在 Supabase Dashboard 执行迁移语句。
- **App.tsx 路由模式**：底部 6 个 tab（today/tasks/calendar/achievements/gacha/shop/settings），各视图用 `{activeTab === 'xxx' && <View />}` 条件渲染，包裹在 `AnimatePresence` + `motion.div` 中。
- **Layout 组件**：固定顶部栏 (h-16) + 底部导航栏 (pb-8 safe-area) + `max-w-md mx-auto` 居中布局。header 左侧为标题，右侧为用户信息（等级/XP/金币/头像）。
