import axios from 'axios';
import { Product } from '@/types/product';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

const client = axios.create({
  baseURL,
  timeout: 10000,
});

export const api = {
  async getProducts(options?: any) {
    const response = await client.get<Product[]>('/api/products', {
      params: options,
    });
    return response.data;
  },

  async getProduct(id: string) {
    const response = await client.get<Product>(`/api/products/${id}`);
    return response.data;
  },

  async getChains() {
    const response = await client.get('/api/chains');
    return response.data;
  },

  async getPortfolio(address: string) {
    const response = await client.get(`/api/portfolio/${address}`);
    return response.data;
  },
};
