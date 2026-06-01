# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Life Bingo — 基于 React 的宾果游戏式任务管理应用。通过完成任务获得 XP、提升等级、抽奖和购买虚拟商品来激励日常行动。定位为 ADHD 友好型生产力工具。

## 常用命令

```bash
npm install              # 安装依赖
npm run dev              # 开发服务器 (port 3000, host 0.0.0.0)
npm run build            # 生产构建
npm run preview          # 预览生产构建
npm run lint             # TypeScript 类型检查 (tsc --noEmit)
npm run clean            # 删除 dist 目录
```

## 环境变量

复制 `.env.example` 为 `.env.local`，配置 Supabase 连接信息：

- `VITE_SUPABASE_URL` — Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY` — Supabase 匿名密钥

- `VITE_SITE_URL` — 生产环境 URL，用于邮箱验证重定向

## 架构

### 核心文件

| 文件 | 用途 |
|------|------|
| `src/App.tsx` (~5900 行) | 整个应用的单体文件，包含所有组件、状态管理和业务逻辑 |
| `src/types.ts` | 所有 TypeScript 类型定义 |
| `src/constants.ts` | 初始数据（任务池、宾果棋盘、成就、商店物品、抽奖池）及游戏配置 |
| `src/gachaUtils.ts` | 抽奖系统逻辑：奖池选择、抽奖次数计算、奖励抽取、保底机制 |
| `src/lib/supabase.ts` | Supabase 客户端初始化 |
| `src/lib/utils.ts` | `cn()` 工具函数（clsx + tailwind-merge） |
| `src/index.css` | Tailwind 指令 + CSS 自定义属性主题变量（zinc 和 dark 两种主题） |
| `bingo.sql` | Supabase 数据库建表语句 |

### App.tsx 结构

`export default function App()` 是应用的根组件，通过 `useState` 管理所有状态。它渲染以下视图之一（由 `activeTab` 状态控制）：

- **LoginView** — Supabase 邮箱/密码认证（注册、登录、邮箱验证、重发验证邮件）
- **TasksView** — 核心视图：任务组管理、宾果棋盘（自定义 3x3 到 6x6）、随机填充、棋盘重置
- **CalendarView** — 已完成任务的历史记录，按日期分组，支持编辑/删除
- **StatsView** — Recharts 图表（折线图、柱状图、饼图），时间范围筛选
- **AchievementsView** — 成就列表，支持自定义成就
- **GachaView** — 等级奖池抽奖（新手/进阶/高级/传说），历史记录
- **ShopView** — 余额商店，等级解锁物品，购买历史
- **PomodoroView** — 番茄钟计时器

底部导航栏提供：今日(Grid)、日历(Calendar)、统计(BarChart2)、成就(Trophy)、设置(Settings)。

### XP 计算

`calculateXP()` 函数：基础值取决于难度（easy=10, medium=20, hard=30），再加优先级加成（low=0, medium=5, high=10）。结果始终为整数。

### 抽奖系统

4 个等级奖池，概率表在 `constants.ts` 中定义。保底机制：连续 3 次低奖励后保底稀有以上；连续 5 次相同类型后强制切换类型。每升一级获得抽奖次数（低等级 1 次/级，高等级 2 次/级）。

### 主题系统

2 种主题（zinc 浅色 / dark 深色），通过 `data-theme` 属性 + CSS 自定义属性实现。主题选择保存在 Supabase settings 表中。

### 数据持久化

Supabase 存储：用户、任务组、宾果棋盘、历史记录、成就、统计数据、设置、商店物品、抽奖状态。认证通过 Supabase Auth，使用 `onAuthStateChange` 监听器保持登录状态。

### 技术栈

React 19, Vite 6, TypeScript 5.8, Tailwind CSS 3.4, Supabase, Lucide React (图标), Motion (动画), Recharts (图表)

## 注意事项

- App.tsx 是单体文件，所有状态和 UI 逻辑集中于此。新增功能应在现有模式基础上扩展。
- 没有测试套件。lint 仅做类型检查（`tsc --noEmit`）。
- `@` 路径别名指向项目根目录（`./*`）。
- HMR 可通过 `DISABLE_HMR` 环境变量禁用（AI Studio 使用）。
- 该应用已部署到 Vercel：https://bingo.vercel.app
