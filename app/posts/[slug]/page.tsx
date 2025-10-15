import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug, getPostSlugs, type PostMetadata } from '@/lib/posts';
import { absoluteUrl, siteConfig } from '@/lib/site-config';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    return { title: '文章未找到' };
  }

  const url = absoluteUrl(`/posts/${slug}`);

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      siteName: siteConfig.name,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary
    }
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const currentPost = post!;
  const currentIndex = posts.findIndex((item: PostMetadata) => item.slug === slug);
  const previous = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <article className="prose prose-slate max-w-none">
      <header className="not-prose mb-10 space-y-4">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← 返回首页
        </Link>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <time>{currentPost.publishedAt}</time>
          <span>·</span>
          <span>{currentPost.tags.join(' / ') || '未分类'}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{currentPost.title}</h1>
        {currentPost.summary ? (
          <p className="text-base text-slate-600">{currentPost.summary}</p>
        ) : null}
      </header>

      <div className="prose-headings:scroll-mt-24 prose-a:text-sky-600 prose-pre:bg-transparent">
        {currentPost.content}
      </div>

      <footer className="not-prose mt-16 grid gap-6 border-t border-slate-200 pt-8 text-sm">
        {previous ? (
          <Link href={`/posts/${previous.slug}`} className="group block">
            <span className="text-xs uppercase tracking-wide text-slate-400">上一篇</span>
            <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
              {previous.title}
            </p>
          </Link>
        ) : null}
        {next ? (
          <Link href={`/posts/${next.slug}`} className="group block">
            <span className="text-xs uppercase tracking-wide text-slate-400">下一篇</span>
            <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{next.title}</p>
          </Link>
        ) : null}
      </footer>
    </article>
  );
}
