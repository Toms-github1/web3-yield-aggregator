'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Product } from '@/types/product';

interface UseProductsOptions {
  chain?: string;
  type?: string;
  sortBy?: 'apy' | 'tvl' | 'risk';
}

export function useProducts(options: UseProductsOptions = {}) {
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products', options],
    queryFn: () => api.getProducts(options),
    refetchInterval: 1000 * 60 * 5, // 每5分钟刷新
  });

  return { products, isLoading, error };
}
