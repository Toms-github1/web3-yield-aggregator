'use client';

import { Product } from '@/types/product';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const getRiskColor = (risk: number) => {
    if (risk <= 3) return 'text-green-400';
    if (risk <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      lending: '借贷',
      yield_farm: '流动性挖矿',
      liquidity_pool: '流动性池',
      staking: '质押',
    };
    return typeMap[type] || type;
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition cursor-pointer h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{product.name}</h3>
            <p className="text-sm text-gray-400">{product.protocol}</p>
          </div>
          <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">
            {product.chain}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-400 flex items-center gap-1">
              <TrendingUp size={24} />
              {product.apy.toFixed(2)}%
            </span>
            <span className="text-gray-400 text-sm">APY</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500">总锁定价值</p>
            <p className="text-white font-semibold">${(product.tvl_usd / 1e6).toFixed(2)}M</p>
          </div>
          <div>
            <p className="text-gray-500">风险等级</p>
            <p className={`font-semibold ${getRiskColor(product.risk_score)}`}>
              {product.risk_score.toFixed(1)}/10
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-400 border-t border-slate-700 pt-4">
          <span>{getTypeLabel(product.type)}</span>
          <span>基础资产: {product.base_token}</span>
        </div>
      </div>
    </Link>
  );
}
