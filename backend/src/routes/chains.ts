import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/chains
router.get('/', async (req, res) => {
  try {
    const chains = await prisma.chain.findMany({
      orderBy: { tvlUsd: 'desc' },
    });
    res.json(chains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chains' });
  }
});

// GET /api/chains/:chainId
router.get('/:chainId', async (req, res) => {
  try {
    const { chainId } = req.params;
    const chain = await prisma.chain.findFirst({
      where: { chainId: parseInt(chainId) },
    });

    if (!chain) {
      return res.status(404).json({ error: 'Chain not found' });
    }

    res.json(chain);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chain' });
  }
});

export default router;
