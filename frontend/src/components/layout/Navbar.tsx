'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import Link from 'next/link';
import { Wallet } from 'lucide-react';

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          🚀 Yield Aggregator
        </Link>

        <div className="flex gap-4 items-center">
          <Link href="/portfolio" className="text-gray-300 hover:text-white transition">
            投资组合
          </Link>
          
          {isConnected && address ? (
            <div className="flex gap-2 items-center bg-slate-800 px-4 py-2 rounded-lg">
              <Wallet size={16} />
              <span className="text-sm text-gray-300">{truncateAddress(address)}</span>
              <button
                onClick={() => disconnect()}
                className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded transition"
              >
                断开
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex gap-2 items-center"
            >
              <Wallet size={16} />
              连接钱包
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
