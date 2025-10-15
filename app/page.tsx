import { PostCard } from '@/components/post-card';
import { getAllPosts, type PostMetadata } from '@/lib/posts';
import { siteConfig } from '@/lib/site-config';

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Hello, world</p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          {siteConfig.author} 的创作实验室
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          {siteConfig.description}
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">最新文章</h2>
        {posts.length ? (
          <div className="grid gap-6">
            {posts.map((post: PostMetadata) => (
              <div key={post.slug}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">第一篇文章还在路上，敬请期待。</p>
        )}
      </section>
    </div>
  );
}
