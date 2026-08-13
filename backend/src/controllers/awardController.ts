import { Request, Response } from 'express';
import prisma from '../config/db';
import { getCache, setCache, clearCachePattern } from '../config/redis';

const CACHE_TTL = 3600;

export async function getAwards(req: Request, res: Response) {
  try {
    const cacheKey = 'awards:all';
    const cached = await getCache(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const awards = await prisma.award.findMany({
      orderBy: { year: 'desc' },
    });

    await setCache(cacheKey, awards, CACHE_TTL);
    res.json(awards);
  } catch (error) {
    console.error('Error fetching awards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createAward(req: Request, res: Response) {
  try {
    const { title, imageUrl, category, year, description } = req.body;
    if (!title || !imageUrl || !category || !year || !description) {
      return res.status(400).json({ error: 'Missing required award fields' });
    }

    const award = await prisma.award.create({
      data: {
        title,
        imageUrl,
        category,
        year: parseInt(year),
        description,
      },
    });

    await clearCachePattern('awards:*');
    await clearCachePattern('stats:*');
    res.status(201).json(award);
  } catch (error) {
    console.error('Error creating award:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function updateAward(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, imageUrl, category, year, description } = req.body;

    const existingAward = await prisma.award.findUnique({ where: { id } });
    if (!existingAward) {
      return res.status(404).json({ error: 'Award not found' });
    }

    const updated = await prisma.award.update({
      where: { id },
      data: {
        title,
        imageUrl,
        category,
        year: year ? parseInt(year) : undefined,
        description,
      },
    });

    await clearCachePattern('awards:*');
    res.json(updated);
  } catch (error) {
    console.error('Error updating award:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function deleteAward(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const existingAward = await prisma.award.findUnique({ where: { id } });
    if (!existingAward) {
      return res.status(404).json({ error: 'Award not found' });
    }

    await prisma.award.delete({ where: { id } });

    await clearCachePattern('awards:*');
    await clearCachePattern('stats:*');
    res.json({ message: 'Award deleted successfully' });
  } catch (error) {
    console.error('Error deleting award:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
