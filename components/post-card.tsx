import Link from 'next/link';
import type { PostMetadata } from '@/lib/posts';

export function PostCard({ post }: { post: PostMetadata }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <header className="mb-4 flex flex-col gap-2">
        <time className="text-xs uppercase tracking-wide text-slate-500">
          {post.publishedAt}
        </time>
        <Link href={`/posts/${post.slug}`} className="text-xl font-semibold text-slate-900">
          {post.title}
        </Link>
        {post.summary ? (
          <p className="text-sm text-slate-600">{post.summary}</p>
        ) : null}
      </header>
      <footer className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
          >
            #{tag}
          </span>
        ))}
      </footer>
    </article>
  );
}
