## Rooms · Supabase Grid

Stack：Next.js 15 App Router + Supabase + Tailwind CSS 4 + Zustand。你可以注册/登录、创建公开房间、在 20×20 网格中摆放物件，并在游玩页通过键盘操控角色查看互动信息。

### 功能清单

- Supabase Auth 登录注册（邮箱 + 密码）
- 个人房间创建/唯一约束，RLS 控制写权限
- 物件字典 + 稀疏 tile 表，CSS Grid 编辑器
- 编辑器：物件选择、左键放置、右键删除、属性面板
- 房间游玩页：键盘移动、邻格互动、实时 presence
- Supabase Realtime：tile 更新与 presence 广播

### 快速开始

1. 安装依赖：

```bash
npm install
```

2. 配置 Supabase：

- 在 `supabase/config.toml` 配置本地 `project_id`；
- 执行数据库迁移：`npm run db:push`。

3. 配置环境变量（`.env.local`）：

```
NEXT_PUBLIC_SUPABASE_URL=<project-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<publishable-key>
```

4. 启动开发服务器：

```bash
npm run dev
```

打开 `http://localhost:3000`，注册新账号后即可进入 Dashboard，创建房间并开始编辑。

### 脚本

- `npm run lint`：使用 `eslint` 校验
- `npm run db:push`：推送 Supabase schema
- `npm run vercel:dev`：Vercel CLI 模拟

### 部署

部署到 Vercel，设置 `NEXT_PUBLIC_SUPABASE_URL` 与 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`。如使用 Edge Runtime，可在 `next.config.ts` 中调整 route segment 的 runtime。
