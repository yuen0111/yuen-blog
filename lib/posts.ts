import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { cache, type ReactNode } from 'react';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export interface PostFrontmatter {
  title: string;
  summary?: string;
  publishedAt: string;
  tags?: string[];
  draft?: boolean;
}

export interface PostMetadata {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
}

export interface Post extends PostMetadata {
  content: ReactNode;
}

function isPostFrontmatter(value: unknown): value is PostFrontmatter {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const data = value as Record<string, unknown>;

  return typeof data.title === 'string' && typeof data.publishedAt === 'string';
}

async function readPostFile(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  return fs.readFile(filePath, 'utf8');
}

async function listPostFiles(): Promise<string[]> {
  const files = await fs.readdir(POSTS_DIR);
  return files
    .filter((file: string) => file.endsWith('.mdx'))
    .map((file: string) => file.replace(/\.mdx$/, ''));
}

function normalizeMetadata(slug: string, data: PostFrontmatter): PostMetadata {
  return {
    slug,
    title: data.title,
    summary: data.summary ?? '',
    publishedAt: data.publishedAt,
    tags: data.tags ?? []
  };
}

export const getAllPosts = cache(async (): Promise<PostMetadata[]> => {
  const slugs = await listPostFiles();
  const posts = await Promise.all(
    slugs.map(async (slug: string) => {
      const source = await readPostFile(slug);
      const { data } = matter(source);

      if (!isPostFrontmatter(data) || data.draft) {
        return null;
      }

      return normalizeMetadata(slug, data);
    })
  );

  return posts
    .filter((post): post is PostMetadata => Boolean(post))
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
});

export async function getPostBySlug(slug: string): Promise<Post> {
  const source = await readPostFile(slug);

  const { content, frontmatter } = await compileMDX<PostFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]
      }
    }
  });

  if (!isPostFrontmatter(frontmatter) || frontmatter.draft) {
    throw new Error(`Post "${slug}" is missing required frontmatter.`);
  }

  return {
    ...normalizeMetadata(slug, frontmatter),
    content
  };
}

export const getPostSlugs = cache(async () => listPostFiles());
