'use client';

import { WagmiConfig, createConfig, mainnet, bsc, polygon } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [mainnet, bsc, polygon],
  transports: {
    [mainnet.id]: {}, // Will be configured with Alchemy
    [bsc.id]: {},
    [polygon.id]: {},
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        {children}
      </WagmiConfig>
    </QueryClientProvider>
  );
}
