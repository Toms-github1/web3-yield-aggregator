'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ProductList } from '@/components/products/ProductList';
import { ProductFilters } from '@/components/products/ProductFilters';
import { useProducts } from '@/hooks/useProducts';

export default function Home() {
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'apy' | 'tvl' | 'risk'>('apy');
  
  const { products, isLoading, error } = useProducts({
    chain: selectedChain !== 'all' ? selectedChain : undefined,
    type: selectedType !== 'all' ? selectedType : undefined,
    sortBy,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DeFi 理财产品聚合器</h1>
          <p className="text-gray-400">实时对比所有区块链上的投资产品收益率</p>
        </div>

        <ProductFilters
          selectedChain={selectedChain}
          selectedType={selectedType}
          sortBy={sortBy}
          onChainChange={setSelectedChain}
          onTypeChange={setSelectedType}
          onSortChange={setSortBy}
        />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">加载中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 border border-red-600 rounded-lg p-4 text-red-200">
            加载产品失败: {error.message}
          </div>
        ) : (
          <ProductList products={products} />
        )}
      </main>
    </div>
  );
}
