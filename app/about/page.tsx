import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: '关于我',
  description: `${siteConfig.author} 的背景与理念`
};

export default function AboutPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1>关于我</h1>
      <p>
        你好！我是 {siteConfig.author}，一名正在成长中的全栈开发者。
        这里记录了我在学习 JavaScript、Python 和现代架构思维时的实践与心得。
      </p>
      <p>
        这个博客的目标是把抽象的概念拆解成可执行的步骤，帮助自己与读者更快地打造有价值的产品。
      </p>
      <h2>为什么写博客</h2>
      <ul>
        <li>用输出倒逼输入，让知识更牢固。</li>
        <li>记录问题与解法，降低未来的重复劳动。</li>
        <li>与志同道合的伙伴建立联系。</li>
      </ul>
      <p>欢迎通过社交媒体或邮件与我交流，我们一起进步 🚀</p>
    </div>
  );
}
