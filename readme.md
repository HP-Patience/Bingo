# Life Bingo

基于 React 和 Supabase 的宾果游戏式任务管理应用。完成任务获得 XP、提升等级、抽奖和购买虚拟商品，ADHD 友好型生产力工具。

## 功能特性

- **宾果任务系统**：自定义棋盘尺寸（3x3 到 6x6），任务分组管理
- **等级与经验系统**：完成任务获得 XP，提升等级解锁头衔
- **抽奖系统**：4 级奖池 + 保底机制，抽奖历史记录
- **番茄钟**：专注计时，可自定义时长
- **数据统计**：任务完成图表，进度分析
- **成就系统**：自动检测解锁，成就追踪
- **商店系统**：虚拟商品购买，货币管理
- **主题切换**：zinc 浅色 / dark 深色

## 技术栈

React 19, Vite 6, TypeScript, Tailwind CSS 3, Supabase, Lucide React, Motion, Recharts

## 快速开始

### 环境要求

Node.js 18+

### 安装

```bash
git clone https://github.com/HP-Patience/Bingo.git
cd Bingo
npm install
```

### 环境变量

复制 `.env.example` 为 `.env.local`，填写以下变量：

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SITE_URL=https://your-domain.com
```

### 数据库

在 Supabase 控制台 SQL Editor 中执行 `bingo.sql`。

### 运行

```bash
npm run dev      # 开发服务器 (localhost:3000)
npm run build    # 生产构建
npm run lint     # TypeScript 类型检查
```

## 项目结构

```
Bingo/
├── src/
│   ├── components/        # UI 组件层（29 个视图/弹窗/原子组件）
│   ├── hooks/             # 领域逻辑层（9 个 hook，封装状态 + Supabase 同步）
│   ├── lib/               # 工具（supabase 客户端、gameLogic、utils）
│   ├── App.tsx            # 根组件：组装 hooks + 渲染视图
│   ├── constants.ts       # 初始数据与游戏配置
│   ├── types.ts           # TypeScript 类型定义
│   └── gachaUtils.ts      # 抽奖系统纯函数
├── bingo.sql              # 数据库建表语句
└── vite.config.ts         # Vite 配置（@ 路径别名 → 项目根目录）
```

## 部署

应用已部署到 Vercel：[bingo.vercel.app](https://bingo.vercel.app)

如需自行部署：Fork 仓库 → 在 Vercel 中导入 → 配置上述环境变量 → Deploy。

## 许可证

MIT
