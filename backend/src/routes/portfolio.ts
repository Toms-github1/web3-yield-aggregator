import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/portfolio/:address
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() },
      include: {
        portfolios: {
          include: {
            product: {
              include: {
                chain: true,
                protocol: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate total yield
    const totalYield = user.portfolios.reduce((sum, p) => {
      return sum + (p.totalYieldUsd ? parseFloat(p.totalYieldUsd.toString()) : 0);
    }, 0);

    res.json({
      ...user,
      totalYield,
      portfolioCount: user.portfolios.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// POST /api/portfolio (Create/Update)
router.post('/', async (req, res) => {
  try {
    const { walletAddress, productId, amountInvested } = req.body;

    // Ensure user exists
    let user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: walletAddress.toLowerCase(),
        },
      });
    }

    // Create portfolio entry
    const portfolio = await prisma.portfolio.create({
      data: {
        userId: user.id,
        productId,
        amountInvested: parseFloat(amountInvested),
        status: 'active',
      },
    });

    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create portfolio' });
  }
});

export default router;
