'use client';

import { CHAINS, PRODUCT_TYPES } from '@/constants/filters';

interface ProductFiltersProps {
  selectedChain: string;
  selectedType: string;
  sortBy: 'apy' | 'tvl' | 'risk';
  onChainChange: (chain: string) => void;
  onTypeChange: (type: string) => void;
  onSortChange: (sort: 'apy' | 'tvl' | 'risk') => void;
}

export function ProductFilters({
  selectedChain,
  selectedType,
  sortBy,
  onChainChange,
  onTypeChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">区块链</label>
          <select
            value={selectedChain}
            onChange={(e) => onChainChange(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
          >
            <option value="all">所有链</option>
            {CHAINS.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">产品类型</label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
          >
            <option value="all">所有类型</option>
            {PRODUCT_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">排序方式</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'apy' | 'tvl' | 'risk')}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
          >
            <option value="apy">按 APY 排序 (从高到低)</option>
            <option value="tvl">按 TVL 排序 (从高到低)</option>
            <option value="risk">按风险 (从低到高)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
