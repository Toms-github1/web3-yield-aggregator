import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Web3 Yield Aggregator',
  description: '聚合所有区块链上的DeFi理财产品，实时对比收益率',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
