import { Request, Response } from 'express';
import prisma from '../config/db';
import { getCache, setCache, clearCachePattern } from '../config/redis';

const CACHE_TTL = 3600; // 1 hour

export async function getAllTrainers(req: Request, res: Response) {
  try {
    const cacheKey = 'trainers:all';
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      console.log('Serving trainers from Redis cache');
      return res.json(JSON.parse(cachedData));
    }

    const trainers = await prisma.trainer.findMany({
      orderBy: { name: 'asc' },
    });

    await setCache(cacheKey, trainers, CACHE_TTL);
    res.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getTrainerById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const cacheKey = `trainers:id:${id}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      console.log(`Serving trainer ${id} from Redis cache`);
      return res.json(JSON.parse(cachedData));
    }

    const trainer = await prisma.trainer.findUnique({
      where: { id },
      include: {
        campaigns: {
          include: {
            institution: {
              include: {
                district: {
                  include: {
                    state: true,
                  },
                },
              },
            },
            images: true,
          },
        },
      },
    });

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    await setCache(cacheKey, trainer, CACHE_TTL);
    res.json(trainer);
  } catch (error) {
    console.error('Error fetching trainer by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createTrainer(req: Request, res: Response) {
  try {
    const { name, photoUrl, bio, missionStatement, locationsCovered, institutionsVisited, totalStudentsTrained } = req.body;

    if (!name || !photoUrl || !bio || !missionStatement || !locationsCovered || !institutionsVisited) {
      return res.status(400).json({ error: 'Missing required trainer fields' });
    }

    const trainer = await prisma.trainer.create({
      data: {
        name,
        photoUrl,
        bio,
        missionStatement,
        locationsCovered,
        institutionsVisited,
        totalStudentsTrained: totalStudentsTrained ? parseInt(totalStudentsTrained) : 0,
      },
    });

    // Invalidate trainer cache
    await clearCachePattern('trainers:*');
    await clearCachePattern('stats:*');

    res.status(201).json(trainer);
  } catch (error) {
    console.error('Error creating trainer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function updateTrainer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, photoUrl, bio, missionStatement, locationsCovered, institutionsVisited, totalStudentsTrained } = req.body;

    const existingTrainer = await prisma.trainer.findUnique({ where: { id } });
    if (!existingTrainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    const updatedTrainer = await prisma.trainer.update({
      where: { id },
      data: {
        name,
        photoUrl,
        bio,
        missionStatement,
        locationsCovered,
        institutionsVisited,
        totalStudentsTrained: totalStudentsTrained ? parseInt(totalStudentsTrained) : undefined,
      },
    });

    // Invalidate trainer cache
    await clearCachePattern('trainers:*');
    await clearCachePattern('stats:*');

    res.json(updatedTrainer);
  } catch (error) {
    console.error('Error updating trainer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function deleteTrainer(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const existingTrainer = await prisma.trainer.findUnique({ where: { id } });
    if (!existingTrainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    await prisma.trainer.delete({
      where: { id },
    });

    // Invalidate trainer cache
    await clearCachePattern('trainers:*');
    await clearCachePattern('stats:*');

    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
