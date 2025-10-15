# 🚀 快速参考手册

## 📁 你的项目文件速查表

### 🔵 经常修改的文件

| 文件 | 作用 | 何时修改 |
|------|------|----------|
| `content/posts/*.mdx` | 博客文章 | 写新文章时 |
| `lib/site-config.ts` | 网站配置 | 修改网站名称、描述 |
| `app/globals.css` | 全局样式 | 修改颜色、字体 |
| `components/*.tsx` | 组件 | 添加新功能 |

### 🟢 不需要改的文件

| 文件 | 作用 | 说明 |
|------|------|------|
| `package.json` | 依赖配置 | 安装新包时自动更新 |
| `next.config.ts` | Next.js 配置 | 框架配置，一般不动 |
| `tsconfig.json` | TypeScript 配置 | 类型检查配置 |
| `.gitignore` | Git 忽略文件 | 已配置好 |

---

## 🎨 常用代码片段

### 1. 创建新的 React 组件

```tsx
// components/my-component.tsx
interface MyComponentProps {
  title: string
  count?: number  // 可选参数
}

export function MyComponent({ title, count = 0 }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
    </div>
  )
}
```

**使用**：
```tsx
import { MyComponent } from "@/components/my-component"

<MyComponent title="Hello" count={5} />
```

---

### 2. 创建新页面

```tsx
// app/contact/page.tsx
export default function ContactPage() {
  return (
    <div>
      <h1>联系我</h1>
      <p>邮箱: your@email.com</p>
    </div>
  )
}
```

访问路径：`http://localhost:3000/contact`

---

### 3. 添加新博客文章

```markdown
<!-- content/posts/my-new-post.mdx -->
---
title: "我的新文章"
publishedAt: "2025-10-20"
description: "这是一篇关于学习编程的文章"
tags: ["programming", "learning"]
---

## 标题

这是文章内容...

### 子标题

- 列表项 1
- 列表项 2

**粗体文字** 和 *斜体文字*

```代码块```
\`\`\`

访问路径：`http://localhost:3000/posts/my-new-post`

---

### 4. 读取数据（Server Component）

```tsx
// app/users/page.tsx
async function getUsers() {
  const response = await fetch("https://api.example.com/users")
  const users = await response.json()
  return users
}

export default async function UsersPage() {
  const users = await getUsers()
  
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

---

### 5. 添加交互（Client Component）

```tsx
// components/like-button.tsx
"use client"  // ⚠️ 必须加这一行

import { useState } from "react"

export function LikeButton() {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const handleClick = () => {
    if (isLiked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setIsLiked(!isLiked)
  }

  return (
    <button 
      onClick={handleClick}
      className={isLiked ? "text-red-500" : "text-gray-500"}
    >
      ❤️ {likes}
    </button>
  )
}
```

---

## 🔧 常用命令

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 安装新的包
npm install 包名

# 例如：安装日期处理库
npm install date-fns
```

### Git 命令

```bash
# 查看状态
git status

# 添加所有修改
git add .

# 提交
git commit -m "描述修改内容"

# 推送到 GitHub
git push

# 拉取最新代码
git pull

# 查看提交历史
git log --oneline
```

---

## 🎯 Tailwind CSS 常用类名

### 布局

```tsx
<div className="container mx-auto">  {/* 居中容器 */}
<div className="flex">               {/* 弹性布局 */}
<div className="grid grid-cols-3">  {/* 网格布局，3列 */}
<div className="space-y-4">         {/* 垂直间距 */}
```

### 间距

```tsx
<div className="p-4">    {/* padding: 1rem (16px) */}
<div className="px-6">   {/* padding 左右 */}
<div className="py-2">   {/* padding 上下 */}
<div className="m-4">    {/* margin */}
<div className="mt-8">   {/* margin-top */}
```

### 文字

```tsx
<h1 className="text-4xl font-bold">     {/* 大标题 */}
<p className="text-gray-600">           {/* 灰色文字 */}
<span className="text-sm">              {/* 小字 */}
<div className="text-center">           {/* 居中 */}
```

### 颜色

```tsx
<div className="bg-blue-500">       {/* 蓝色背景 */}
<div className="text-red-500">      {/* 红色文字 */}
<div className="border-gray-300">   {/* 灰色边框 */}
```

### 圆角和阴影

```tsx
<div className="rounded-lg">        {/* 圆角 */}
<div className="shadow-md">         {/* 阴影 */}
<div className="border">            {/* 边框 */}
```

### 悬停效果

```tsx
<button className="hover:bg-blue-600">  {/* 鼠标悬停时变色 */}
<a className="hover:underline">         {/* 鼠标悬停下划线 */}
```

### 响应式

```tsx
<div className="text-sm md:text-lg lg:text-xl">
  {/* 手机小字，平板中字，电脑大字 */}
</div>
```

---

## 🐛 常见错误和解决方法

### 错误 1：`Cannot find module`

**原因**：导入路径错误或包未安装

**解决**：
```bash
# 检查拼写
# 确保使用了正确的别名 @/
# 或者重新安装依赖
npm install
```

---

### 错误 2：`useState is not defined`

**原因**：忘记导入或在 Server Component 中使用

**解决**：
```tsx
// 方法 1：添加导入
import { useState } from "react"

// 方法 2：声明为 Client Component
"use client"
```

---

### 错误 3：`Hydration failed`

**原因**：服务器渲染和客户端渲染内容不一致

**解决**：
- 检查是否在 Server Component 中使用了随机数、日期等会变化的值
- 确保 HTML 结构正确（不要在 `<p>` 里嵌套 `<div>`）

---

### 错误 4：端口被占用

```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决**：
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# 或者修改端口
npm run dev -- -p 3001
```

---

### 错误 5：Git 推送失败

```
error: failed to push some refs
```

**解决**：
```bash
# 先拉取远程更新
git pull origin main

# 再推送
git push
```

---

## 📝 实用技巧

### 1. VS Code 快捷键（macOS）

| 快捷键 | 功能 |
|--------|------|
| `Cmd + P` | 快速打开文件 |
| `Cmd + Shift + P` | 命令面板 |
| `Cmd + /` | 注释代码 |
| `Cmd + D` | 选择下一个相同内容 |
| `Option + 上/下箭头` | 移动行 |
| `Cmd + B` | 显示/隐藏侧边栏 |

---

### 2. 调试技巧

```tsx
// 打印调试
console.log("变量值:", myVariable)

// 查看对象
console.table(users)

// 断点调试（浏览器 DevTools）
debugger
```

---

### 3. TypeScript 类型快速声明

```tsx
// 从现有对象推断类型
const user = { name: "Yuan", age: 23 }
type User = typeof user

// 数组元素类型
const tags = ["js", "react"]
type Tag = typeof tags[number]  // "js" | "react"
```

---

### 4. 快速格式化代码

```bash
# 保存时自动格式化（VS Code 设置）
# Settings → Format On Save → 勾选

# 手动格式化
# macOS: Shift + Option + F
# Windows: Shift + Alt + F
```

---

## 🎓 学习检查清单

### JavaScript 基础
- [ ] 变量声明（let, const）
- [ ] 数据类型（string, number, boolean, array, object）
- [ ] 函数（普通函数、箭头函数）
- [ ] 条件语句（if/else, switch）
- [ ] 循环（for, while, forEach）
- [ ] 数组方法（map, filter, find, reduce）
- [ ] 异步编程（Promise, async/await）

### TypeScript
- [ ] 基本类型注解
- [ ] Interface 和 Type
- [ ] 泛型基础
- [ ] 可选参数 `?`

### React
- [ ] 组件概念
- [ ] Props 传递
- [ ] useState（状态管理）
- [ ] useEffect（副作用）
- [ ] 条件渲染
- [ ] 列表渲染（map）

### Next.js
- [ ] 文件路由
- [ ] Server Component vs Client Component
- [ ] 动态路由 `[slug]`
- [ ] 数据获取（async/await）
- [ ] Metadata（SEO）

---

## 🆘 需要帮助？

### 遇到问题时的步骤

1. **阅读错误信息**（红色文字往往有提示）
2. **Google 搜索**（英文关键词 + "next.js" 或 "react"）
3. **查看官方文档**
4. **问我**（我随时在这里！）

### 推荐搜索网站

- [Stack Overflow](https://stackoverflow.com/)（最权威）
- [掘金](https://juejin.cn/)（中文社区）
- [SegmentFault](https://segmentfault.com/)
- [MDN](https://developer.mozilla.org/)（Web 标准）

---

**记住**：每个开发者都是从这里开始的，不要怕犯错！💪

祝学习愉快！🚀
