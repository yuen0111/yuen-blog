export const siteConfig = {
  name: 'Yuen',
  description: '记录自己在全栈的学习',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  author: 'Yuen'
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
