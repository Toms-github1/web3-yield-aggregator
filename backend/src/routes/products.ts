import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'redis';

const router = Router();
const prisma = new PrismaClient();
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { chain, type, sortBy = 'apy' } = req.query;
    
    // Try to get from cache
    const cacheKey = `products:${chain}:${type}:${sortBy}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Query database
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(chain && chain !== 'all' && { chain: { name: { equals: String(chain), mode: 'insensitive' } } }),
        ...(type && type !== 'all' && { type: String(type) }),
      },
      include: {
        chain: true,
        protocol: true,
      },
      orderBy: {
        ...(sortBy === 'apy' && { apy: 'desc' }),
        ...(sortBy === 'tvl' && { tvlUsd: 'desc' }),
        ...(sortBy === 'risk' && { riskScore: 'asc' }),
      },
    });

    // Cache for 5 minutes
    await redis.setEx(cacheKey, 300, JSON.stringify(products));

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        chain: true,
        protocol: true,
        apyHistory: {
          take: 30,
          orderBy: { recordedAt: 'desc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
