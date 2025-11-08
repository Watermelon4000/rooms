# Rooms 项目工作流与问题记录

## 工作流概览

1. **环境与配置**
   - 配置 `.env.local`：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
   - Supabase CLI：`supabase login` → `supabase link --project-ref <ref>` → `npm run db:push`

2. **主要功能模块**
   - Auth：使用 `@supabase/auth-ui-react`，`profiles` 触发器在 `auth.users` 插入时自动补全
   - Dashboard：概览 + “我的房间”卡片 + 公共房间列表
   - 编辑器：20×20 CSS Grid、物件面板、属性编辑、Realtime 同步
   - 游玩页：WASD/Enter 控制、Presence、物件检查面板
   - 导航：侧边栏 (`SidebarNav`) 提供“控制台 / 公共房间 / 我的房间”入口
   - 新 routes：`/rooms`（公开房间大厅）、`/my-room`（自动跳转到编辑器）

3. **数据库与 API**
   - `supabase/migrations/0001_rooms.sql` 定义 `profiles`/`rooms`/`room_tiles`/`item_catalog`/RLS
   - 触发器 `0002_profiles_trigger.sql`：创建 `handle_new_user`
   - API：`/api/room/ensure`, `/api/tiles/upsert`, `/api/auth/callback`

## 已解决问题列表

| 序号 | 问题 | 解决方案 |
| --- | --- | --- |
| 1 | `store.get is not a function`（server cookies API 变更） | `cookies()` 改 async，并更新所有 server-side Supabase 调用 |
| 2 | `publicRoomsRaw.map` 报错（`data: null`） | 所有 Supabase 查询统一 `const list = data ?? []` |
| 3 | “Email not confirmed” 卡死 + profile 不生成 | 使用 Supabase Auth UI + 在 DB 添加 `handle_new_user` trigger |
| 4 | App Router `params` Promise 报错 | 在 `/editor/[id]`、`/room/[id]` 等页面 `await params` |
| 5 | 游玩页提示和操作键不一致 | 操作说明放到右侧卡片，`Player` 改为 `Enter` 互动 |
| 6 | 编辑器不明显是 20×20 | 网格右上角显示尺寸徽标，提示文案强调固定尺寸 |
| 7 | Icon 显示为文本不美观 | 引入 Material Symbols，`RoomGrid` 用 `MaterialIcon` 组件，`item_catalog` 新图标 |
| 8 | CSS 构建报 “@import rules must precede” | 删除 `@import`，在 `globals.css` 内用 `@font-face` 引入字体 |
| 9 | 导航重复 + Vercel 按钮冗余 | 改为 Sidebar 布局，删掉多余卡片与按钮，添加 `/rooms` `/my-room` |
| 10 | Sign-in/up 自定义表单维护成本高 | 引入 `@supabase/auth-ui-react`，减少自维护逻辑 |

## 重要路径

- `src/app/layout.tsx`: 主题、侧边栏、Supabase Listener、Toaster
- `src/app/dashboard/page.tsx`: 控制台 + 我的房间卡片
- `src/app/rooms/page.tsx`: 公共房间列表
- `src/app/my-room/page.tsx`: 确保后跳编辑器
- `src/app/editor/[id]/editor-client.tsx`: 编辑器逻辑
- `src/app/room/[id]/room-client.tsx`: 游玩逻辑与操作提示
- `src/components/sidebar-nav.tsx`: 新侧边导航
- `supabase/migrations/*`: 数据模型与触发器

## 下一步建议

1. 添加 `/rooms` 搜索/筛选、热门排序
2. 扩展物件字典（可上传自定义 icon 或 sprite）
3. 为物件互动增加更多类型（链接、对话、图片等）
4. 增加移动端虚拟摇杆或触控支持

## 2025-11-08 Landing & Dashboard 改版记录

1. **Landing / 首页**
   - 引入 `motion-example-parallax` 与 `rotating-earth` 模板资产，创建全屏旋转地球背景 (`RotatingEarthBackground`)。
   - Home hero 文案改为像素字体（VT323），按钮配色统一为黑底白字；移除多余按钮和描述行，使画面聚焦在标题 + CTA。
   - 删除 ChatPill 浮动按钮、Feature 介绍段落、Footer 的部分列（指南/支持），只保留产品 & Pathunfold 社区链接。
   - 调整手机段 `Feature` Section padding，去除 hero 主题切换按钮的原位置（挪至 frame 左上角）。
   - 将 hero 结构拆为 marketing / app route group，landing 留在 `/`, 内页走 `(app)`。

2. **Sidebar & App Layout**
   - Sidebar 全新样式：折叠状态只显示指甲盖大小 icon，隐藏退出模块；展开显示 2xl “ROOMS” 文案、用户信息和 SignOut。
   - 添加响应式 `matchMedia` 同步 `--sidebar-width` CSS 变量，并在 `(app)/layout.tsx` 使用该变量控制内容左边距，保证折叠时主区域自适应。
   - 移除顶部通知组件，仅保留主题切换与用户菜单。

3. **Dashboard**
   - `RoomSettingsForm` 组件：可编辑房间标题、网格尺寸、公开状态，调用新建的 `/api/room/update`（PATCH）接口写入 Supabase。
   - Dashboard hero 卡片合并房间详情、快速操作和设置表单；删除“小卡片”与“社区快照”等冗余模块，让概览、房间信息、公共房间目录三段结构更直接。
   - 移除总览卡片的副标题及 CTA 按钮行，突出房间状态和设置。

4. **Routes & API**
   - 新增 `src/app/(app)/api/room/update/route.ts`：校验 roomId、标题、gridSize、isPublic，确保只允许房主修改。
   - `ItemPalette` 仅渲染 Supabase `item_catalog.icon`，不再显示文字，保持视觉一致。

5. **其他**
   - 顶部 hero hero-section 结构重新组织，使 RotatingEarth 背景铺满全屏；按钮、文本全部使用白色像素体。
   - Lint ignore 扩展到 `code/`、`motion-example-parallax-templete/`、`rotating-earth/`，避免第三方模板触发错误。

## 2025-11-08 Gemini AI Assistant 工作记录

1.  **构建失败修复**
    - 修复了一系列 TypeScript 类型错误，包括：
        - 为从 Supabase 获取的数据添加了 null 检查。
        - 导出了缺失的 `ButtonProps` 类型。
        - 修正了 `TileOperation` 联合类型的类型缩小问题。
    - 将 `素材` 目录从 TypeScript 构建中排除。

2.  **修复邮箱显示问题**
    - 修改了 Supabase 触发器 `handle_new_user`，使其在用户名未设置时不再回退到使用邮箱。
    - 在 Dashboard 页面 (`dashboard/page.tsx`) 和公共房间页面 (`rooms/page.tsx`) 添加了检查，以防止为现有用户显示作为用户名的邮箱地址。