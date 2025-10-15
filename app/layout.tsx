import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import "./globals.css";
import { SiteHeader } from '@/components/site-header';
import { siteConfig } from '@/lib/site-config';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author }],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'zh_CN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description
  }
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl px-6 py-12">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-3xl px-6 pb-12 text-sm text-slate-500">
          © {new Date().getFullYear()} {siteConfig.author}. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
