# 🎓 个人博客项目学习指南

## 📚 目录
1. [项目结构说明](#项目结构说明)
2. [核心文件解析](#核心文件解析)
3. [技术栈学习路线](#技术栈学习路线)
4. [实践练习](#实践练习)

---

## 📁 项目结构说明

```
personal-blog/
├── app/                    # Next.js 15 的页面目录（核心）
│   ├── layout.tsx         # 全局布局：网站的外壳
│   ├── page.tsx           # 首页：显示所有博客文章
│   ├── about/             # 关于页面
│   │   └── page.tsx
│   ├── posts/             # 博客文章详情页
│   │   └── [slug]/        # 动态路由：根据文章 slug 显示不同内容
│   │       └── page.tsx
│   └── globals.css        # 全局样式
│
├── components/            # 可复用的 React 组件
│   ├── site-header.tsx   # 网站头部导航
│   └── post-card.tsx     # 博客卡片组件
│
├── content/              # 博客文章内容（Markdown 格式）
│   └── posts/
│       ├── hello-world.mdx
│       └── goal.mdx
│
├── lib/                  # 工具函数库
│   ├── site-config.ts   # 网站配置
│   ├── posts.ts         # 文章管理逻辑
│   └── utils.ts         # 辅助函数
│
├── public/              # 静态资源（图片、图标等）
│
├── package.json         # 项目依赖配置
├── tsconfig.json        # TypeScript 配置
├── next.config.ts       # Next.js 配置
└── tailwind.config.ts   # Tailwind CSS 配置
```

---

## 🔍 核心文件解析

### 1. `package.json` - 项目的"身份证"

```json
{
  "name": "personal-blog",           // 项目名称
  "version": "0.1.0",               // 版本号
  "scripts": {                      // 命令脚本
    "dev": "next dev --turbopack",  // 开发模式（npm run dev）
    "build": "next build",          // 构建生产版本
    "start": "next start"           // 启动生产服务器
  },
  "dependencies": {                 // 项目依赖
    "react": "^19.1.0",            // React 库
    "next": "15.5.5",              // Next.js 框架
    "typescript": "^5"             // TypeScript
  }
}
```

**作用**：定义项目信息、依赖包、运行脚本

---

### 2. `app/layout.tsx` - 全局布局（网站的骨架）

```tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { siteConfig } from "@/lib/site-config"

// 🎨 导入 Inter 字体
const inter = Inter({ subsets: ["latin"] })

// 📝 网站元数据（SEO 优化）
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // OpenGraph 用于社交媒体分享预览
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "zh_CN",
    type: "website",
  },
}

// 🏗️ 根布局组件
export default function RootLayout({
  children, // 子页面内容
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <SiteHeader /> {/* 导航栏 */}
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {children} {/* 页面内容会插入这里 */}
        </main>
        <footer className="border-t py-6 text-center text-sm text-gray-600">
          © 2025 {siteConfig.author}. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
```

**关键概念**：
- **`Metadata`**：网站元信息（标题、描述），影响 SEO
- **`children`**：React 的特殊 prop，代表子组件
- **布局复用**：所有页面都会包裹在这个布局里

---

### 3. `app/page.tsx` - 首页（博客列表）

```tsx
import Link from "next/link"
import { PostCard } from "@/components/post-card"
import { getAllPosts } from "@/lib/posts"

// 🏠 首页组件（Server Component）
export default async function Home() {
  // 📖 获取所有博客文章
  const posts = await getAllPosts()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">欢迎来到我的博客</h1>
        <p className="text-gray-600">
          分享技术、思考和生活
        </p>
      </div>

      {/* 📝 博客文章列表 */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        ) : (
          <p className="text-gray-500">暂无文章</p>
        )}
      </div>
    </div>
  )
}
```

**关键概念**：
- **`async/await`**：异步编程，等待数据加载完成
- **`map()`**：数组方法，遍历每个文章生成 PostCard 组件
- **Server Component**：在服务器端运行，可以直接读取数据

---

### 4. `app/posts/[slug]/page.tsx` - 文章详情页（动态路由）

```tsx
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { notFound } from "next/navigation"

// 🎯 动态路由：[slug] 表示这是一个参数
// 访问 /posts/hello-world 时，slug = "hello-world"
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  // 📄 根据 slug 获取文章
  const post = await getPostBySlug(slug)
  
  // 🚫 文章不存在，显示 404
  if (!post) {
    notFound()
  }

  return (
    <article className="prose prose-gray max-w-none">
      {/* 🎨 文章头部 */}
      <div className="mb-8 border-b pb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <time>{post.publishedAt}</time>
          {post.tags && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 📝 文章内容（MDX 渲染） */}
      <div>{post.content}</div>
    </article>
  )
}

// 🚀 静态生成：构建时预生成所有文章页面
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

**关键概念**：
- **动态路由 `[slug]`**：根据 URL 参数显示不同内容
- **`generateStaticParams`**：告诉 Next.js 要生成哪些页面
- **SSG（静态生成）**：构建时生成 HTML，速度最快

---

### 5. `components/post-card.tsx` - 博客卡片组件

```tsx
import Link from "next/link"
import type { PostMetadata } from "@/lib/posts"

// 📦 组件接收的数据类型
interface PostCardProps {
  post: PostMetadata
}

// 🎴 博客卡片组件（可复用）
export function PostCard({ post }: PostCardProps) {
  return (
    <Link 
      href={`/posts/${post.slug}`}
      className="block p-6 border rounded-lg hover:border-gray-400 transition"
    >
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-4">{post.description}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <time>{post.publishedAt}</time>
        {post.tags && (
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
```

**关键概念**：
- **Props（属性）**：父组件传递给子组件的数据
- **TypeScript `interface`**：定义数据类型，防止错误
- **组件复用**：可以在多个地方使用这个卡片

---

### 6. `lib/posts.ts` - 文章管理逻辑

```tsx
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"

// 📁 文章目录路径
const postsDirectory = path.join(process.cwd(), "content/posts")

// 📝 文章元数据类型
export interface PostMetadata {
  slug: string
  title: string
  publishedAt: string
  description?: string
  tags?: string[]
}

// 📚 获取所有文章
export async function getAllPosts(): Promise<PostMetadata[]> {
  // 1️⃣ 读取 content/posts 目录
  const fileNames = fs.readdirSync(postsDirectory)
  
  // 2️⃣ 遍历每个文件
  const posts = fileNames
    .filter((name) => name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      
      // 3️⃣ 解析 frontmatter（文章头部信息）
      const { data } = matter(fileContents)
      
      return {
        slug,
        title: data.title,
        publishedAt: data.publishedAt,
        description: data.description,
        tags: data.tags,
      }
    })
    // 4️⃣ 按日期排序（最新的在前）
    .sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

  return posts
}

// 📄 根据 slug 获取单篇文章
export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  
  // 文件不存在
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  // 🎨 编译 MDX（Markdown + React 组件）
  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: true,
    },
  })

  return {
    slug,
    title: data.title,
    publishedAt: data.publishedAt,
    description: data.description,
    tags: data.tags,
    content: mdxContent,
  }
}
```

**关键概念**：
- **`fs`（File System）**：Node.js 文件系统模块，读取文件
- **`gray-matter`**：解析 Markdown 文件头部的元数据
- **`compileMDX`**：将 Markdown 转换为 React 组件
- **缓存**：`cache()` 函数避免重复读取文件

---

### 7. `content/posts/goal.mdx` - 博客文章（Markdown）

```markdown
---
title: "轨迹"
publishedAt: "2025-10-15"
description: "记录我人生的选择"
tags: ["life", "personal"]
---

## 我的故事

今天是 2025 年 10 月 15 日...

### 选择

我现在面临两个选择：
1. 考公务员
2. 做全栈开发

...
```

**结构说明**：
- **Frontmatter（头部）**：`---` 之间的 YAML 格式元数据
- **正文**：使用 Markdown 语法编写（`#` 标题、列表等）
- **MDX 扩展**：可以在 Markdown 中使用 React 组件

---

## 🚀 技术栈学习路线

### 阶段 1：JavaScript 基础（2-3 周）

#### 📖 必学概念

1. **变量与数据类型**
```javascript
// 变量声明
let name = "Yuan"          // 字符串
const age = 23             // 数字（常量）
let isStudent = true       // 布尔值

// 数组
const hobbies = ["coding", "reading", "music"]

// 对象
const person = {
  name: "Yuan",
  age: 23,
  greet: function() {
    console.log("Hello!")
  }
}
```

2. **函数**
```javascript
// 函数声明
function add(a, b) {
  return a + b
}

// 箭头函数（常用）
const multiply = (a, b) => a * b

// 异步函数
async function fetchData() {
  const response = await fetch("/api/data")
  const data = await response.json()
  return data
}
```

3. **数组方法**
```javascript
const numbers = [1, 2, 3, 4, 5]

// map：转换数组
const doubled = numbers.map(n => n * 2)  // [2, 4, 6, 8, 10]

// filter：过滤数组
const even = numbers.filter(n => n % 2 === 0)  // [2, 4]

// find：查找元素
const found = numbers.find(n => n > 3)  // 4
```

#### 🎯 练习项目
- ✅ 计算器
- ✅ Todo List（待办事项）
- ✅ 简单的问卷调查

---

### 阶段 2：TypeScript（1-2 周）

#### 📖 必学概念

```typescript
// 1. 类型注解
let username: string = "Yuan"
let age: number = 23
let isActive: boolean = true

// 2. 接口（定义对象结构）
interface User {
  id: number
  name: string
  email?: string  // ? 表示可选
}

const user: User = {
  id: 1,
  name: "Yuan"
}

// 3. 类型别名
type PostStatus = "draft" | "published" | "archived"

// 4. 泛型（灵活的类型）
function getFirstItem<T>(arr: T[]): T {
  return arr[0]
}

const firstNumber = getFirstItem([1, 2, 3])  // 类型：number
const firstName = getFirstItem(["a", "b"])   // 类型：string
```

#### 🎯 为什么用 TypeScript？
- ✅ **错误提前发现**：编写时就能发现类型错误
- ✅ **智能提示**：IDE 自动补全代码
- ✅ **代码可维护**：团队协作更安全

---

### 阶段 3：React（2-3 周）

#### 📖 必学概念

1. **组件基础**
```tsx
// 函数组件
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

// 使用组件
<Greeting name="Yuan" />
```

2. **Props（属性传递）**
```tsx
interface ButtonProps {
  text: string
  onClick: () => void
  variant?: "primary" | "secondary"
}

function Button({ text, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={variant === "primary" ? "bg-blue-500" : "bg-gray-500"}
    >
      {text}
    </button>
  )
}

// 使用
<Button text="点击我" onClick={() => alert("Clicked!")} />
```

3. **State（状态管理）**
```tsx
import { useState } from "react"

function Counter() {
  // count 是状态，setCount 是更新函数
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  )
}
```

4. **Effect（副作用）**
```tsx
import { useEffect, useState } from "react"

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null)

  // 组件加载时获取数据
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      setUser(data)
    }
    fetchUser()
  }, [userId])  // userId 变化时重新执行

  return <div>{user?.name}</div>
}
```

#### 🎯 练习项目
- ✅ 博客阅读列表（就像你现在的项目）
- ✅ 天气应用（调用 API）
- ✅ 购物车

---

### 阶段 4：Next.js（2-3 周）

#### 📖 必学概念

1. **文件路由**
```
app/
├── page.tsx           → /
├── about/
│   └── page.tsx       → /about
└── posts/
    └── [slug]/
        └── page.tsx   → /posts/hello (动态)
```

2. **Server Component vs Client Component**
```tsx
// ✅ Server Component（默认）
// - 在服务器运行
// - 可以直接读取数据库/文件
// - 无法使用 useState、useEffect
async function BlogList() {
  const posts = await getAllPosts()  // 直接读取
  return <div>{posts.map(...)}</div>
}

// ✅ Client Component（需要交互）
"use client"  // 声明为客户端组件

import { useState } from "react"

function LikeButton() {
  const [likes, setLikes] = useState(0)
  return <button onClick={() => setLikes(likes + 1)}>
    ❤️ {likes}
  </button>
}
```

3. **数据获取**
```tsx
// SSG（静态生成）- 构建时生成
export async function generateStaticParams() {
  return [{ slug: "post-1" }, { slug: "post-2" }]
}

// SSR（服务端渲染）- 每次请求都重新获取
export const dynamic = "force-dynamic"

async function Page() {
  const data = await fetch("/api/data")
  return <div>{data}</div>
}
```

#### 🎯 练习项目
- ✅ 你的博客（已完成 ✅）
- ✅ 添加评论功能
- ✅ 添加搜索功能

---

### 阶段 5：Node.js（1-2 周）

#### 📖 必学概念

```javascript
// 1. 文件操作
const fs = require("fs")
const content = fs.readFileSync("file.txt", "utf-8")

// 2. HTTP 服务器
const http = require("http")
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" })
  res.end("<h1>Hello World</h1>")
})
server.listen(3000)

// 3. Express 框架（常用）
const express = require("express")
const app = express()

app.get("/api/posts", (req, res) => {
  res.json({ posts: [] })
})

app.listen(3000)
```

#### 🎯 练习项目
- ✅ REST API
- ✅ 文件上传服务
- ✅ 聊天应用（WebSocket）

---

## 🛠️ 实践练习

### 练习 1：修改博客首页标题

**目标**：把首页的"欢迎来到我的博客"改成"Yuan 的技术博客"

**步骤**：
1. 打开 `app/page.tsx`
2. 找到 `<h1>欢迎来到我的博客</h1>`
3. 修改为 `<h1>Yuan 的技术博客</h1>`
4. 保存文件，浏览器自动刷新

---

### 练习 2：添加文章浏览次数

**目标**：每篇文章显示"👀 123 次浏览"

**步骤**：
1. 在 `content/posts/goal.mdx` 的 frontmatter 添加：
```yaml
views: 123
```

2. 修改 `lib/posts.ts` 的 `PostMetadata` 接口：
```typescript
export interface PostMetadata {
  slug: string
  title: string
  publishedAt: string
  description?: string
  tags?: string[]
  views?: number  // 新增
}
```

3. 修改 `components/post-card.tsx`，显示浏览次数：
```tsx
<div className="flex justify-between items-center text-sm text-gray-500">
  <time>{post.publishedAt}</time>
  <span>👀 {post.views || 0} 次浏览</span>
</div>
```

---

### 练习 3：添加深色模式

**目标**：点击按钮切换深色/浅色主题

**提示**：
- 使用 `useState` 保存当前主题
- 根据主题添加/移除 `dark` class
- 使用 Tailwind 的 `dark:` 前缀

---

## 📚 推荐学习资源

### 免费资源

1. **JavaScript**
   - [MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)（最权威）
   - [JavaScript.info](https://zh.javascript.info/)（从零到精通）

2. **TypeScript**
   - [官方文档（中文）](https://www.typescriptlang.org/zh/docs/)
   - [TypeScript 入门教程](https://ts.xcatliu.com/)

3. **React**
   - [React 官方文档（中文）](https://zh-hans.react.dev/)
   - [React 新手教程](https://zh-hans.react.dev/learn)

4. **Next.js**
   - [Next.js 官方文档（中文）](https://nextjs.org/docs)
   - [Next.js 中文教程](https://www.nextjs.cn/)

### 视频教程

1. **B站推荐**
   - [黑马程序员 - JavaScript 全套](https://www.bilibili.com/video/BV1Sy4y1C7ha)
   - [技术胖 - React 入门到实战](https://www.bilibili.com/video/BV1g4411i7po)
   - [峰华前端工程师 - Next.js 完整教程](https://www.bilibili.com/video/BV1Sy4y1C7ha)

2. **YouTube（需科学上网）**
   - [Traversy Media](https://www.youtube.com/@TraversyMedia)
   - [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified)

---

## 🎯 30 天学习计划

| 周次 | 学习内容 | 实践项目 |
|------|---------|----------|
| 第 1 周 | JavaScript 基础 | 计算器、Todo List |
| 第 2 周 | JavaScript 进阶 + TypeScript | 类型化的 Todo List |
| 第 3 周 | React 基础 | 天气应用 |
| 第 4 周 | React 进阶 + Next.js | 完善你的博客 |

每天建议学习时间：**2-3 小时**

---

## 💡 学习建议

1. **边学边练**：看完一个概念立即写代码实践
2. **阅读报错信息**：错误提示是最好的老师
3. **Google/查文档**：遇到问题先搜索，养成好习惯
4. **写技术博客**：把学到的知识写成博客文章
5. **参与开源项目**：GitHub 上找简单的项目贡献代码

---

## 🤝 下一步

### 立即开始
1. 打开 VS Code
2. 修改 `app/page.tsx` 的标题
3. 保存并查看效果
4. 恭喜你完成第一次代码修改！🎉

### 深入学习
1. 完成上面的 3 个练习
2. 阅读 React 官方文档的"快速入门"
3. 每天写 1 小时代码

### 寻求帮助
- 遇到问题随时问我
- 加入技术社区（掘金、SegmentFault）
- 参与技术讨论

---

**记住**：编程是一门实践的艺术，**多写代码**比看 100 个教程都有用！💪

加油，Yuan！你已经迈出了第一步！🚀
