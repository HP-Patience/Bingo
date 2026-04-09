# Life Bingo

一个基于 React 和 Supabase 的生活任务管理应用，采用宾果游戏的形式激励用户完成任务，提升生活质量。

## 功能特性

- 🎯 **宾果任务系统**：可自定义格子大小（3x3 到 6x6），任务分类和管理
- 📈 **等级与经验系统**：完成任务获得经验值，提升等级解锁新功能
- 💰 **抽奖系统**：基于等级的奖励池，抽奖历史记录
- ⏰ **时间管理工具**：番茄钟功能，任务计时
- 📊 **数据统计与分析**：任务完成情况图表，进度统计
- 🏆 **成就系统**：成就解锁，成就跟踪
- 🛒 **商店系统**：虚拟商品购买，货币管理
- 🎨 **主题切换**：支持不同主题模式
- 📅 **日历视图**：任务日历展示

## 技术栈

- **前端框架**：React 19.0.0
- **构建工具**：Vite 6.2.0
- **样式方案**：Tailwind CSS 3.4.1
- **类型系统**：TypeScript 5.8.2
- **图标库**：Lucide React 0.546.0
- **动画库**：Motion 12.23.24
- **图表库**：Recharts 3.8.1
- **AI 集成**：Google GenAI 1.29.0
- **后端服务**：Supabase

## 快速开始

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn

### 安装步骤

1. **克隆仓库**：
   ```bash
   git clone https://github.com/HP-Patience/Bingo.git
   cd life-bingo
   ```
2. **安装依赖**：
   ```bash
   npm install
   ```
3. **配置环境变量**：
   - 复制 `.env.example` 文件为 `.env.local`
   - 填写 Supabase 项目信息：
     ```
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
4. **配置 Supabase 数据库**：
   - 在 Supabase 控制台中执行 `bingo.sql` 文件中的 SQL 语句创建数据表

### 运行项目

- **开发模式**：
  ```bash
  npm run dev
  ```
- **构建生产版本**：
  ```bash
  npm run build
  ```
- **预览生产版本**：
  ```bash
  npm run preview
  ```

## 部署

### Supabase 配置

1. **创建 Supabase 项目**：
   - 登录 [Supabase](https://supabase.com/)
   - 创建新项目
   - 在 SQL 编辑器中执行 `bingo.sql` 文件中的 SQL 语句
2. **启用认证**：
   - 在 Supabase 控制台中，进入 **Authentication** 页面
   - 启用 **Email** 认证方式

### Vercel 部署

1. **登录 Vercel**：
   - 访问 [Vercel 官网](https://vercel.com/)
   - 使用 GitHub 账号登录
2. **创建新项目**：
   - 点击 **New Project**
   - 选择你的 GitHub 仓库
   - 点击 **Import**
3. **配置环境变量**：
   - 在 **Environment Variables** 中添加：
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
4. **部署**：
   - 点击 **Deploy** 按钮
   - 部署完成后，访问 Vercel 生成的 URL

## 项目结构

```
life-bingo/
├── public/              # 静态资源
├── src/
│   ├── lib/             # 工具函数
│   │   └── supabase.ts  # Supabase 配置
│   ├── App.tsx          # 主应用组件
│   ├── constants.ts     # 常量定义
│   ├── gachaUtils.ts    # 抽奖系统工具
│   ├── index.css        # 全局样式
│   ├── main.tsx         # 应用入口
│   └── types.ts         # TypeScript 类型定义
├── .env.example         # 环境变量示例
├── .gitignore           # Git 忽略文件
├── bingo.sql            # 数据库初始化 SQL
├── README.md            # 项目说明
├── package.json         # 依赖管理
├── postcss.config.js    # PostCSS 配置
├── tailwind.config.js   # Tailwind 配置
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 使用说明

1. **注册/登录**：
   - 首次使用需要注册账号
   - 注册后需要验证邮箱
   - 使用验证后的邮箱和密码登录
2. **创建任务**：
   - 点击任务组，添加新任务
   - 设置任务名称、描述和截止日期
   - 选择任务优先级和难度
3. **完成任务**：
   - 在宾果网格中点击任务完成
   - 完成任务后获得经验值和奖励
4. **升级与奖励**：
   - 积累经验值提升等级
   - 等级提升后获得抽奖机会
   - 使用抽奖机会获取奖励
5. **统计与分析**：
   - 在统计页面查看任务完成情况
   - 分析自己的任务完成趋势

## 贡献

欢迎贡献代码和提出建议！请按照以下步骤：

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目链接：<https://github.com/HP-Patience/Bingo>
- 部署链接：<https://bingo.vercel.app>

***

**享受使用 Life Bingo 管理你的生活任务！** 🎉
