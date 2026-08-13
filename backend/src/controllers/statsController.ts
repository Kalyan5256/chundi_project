import { Request, Response } from 'express';
import prisma from '../config/db';
import { getCache, setCache } from '../config/redis';

const CACHE_KEY = 'stats:dashboard';
const CACHE_TTL = 1800; // 30 minutes

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const cached = await getCache(CACHE_KEY);
    if (cached) {
      console.log('Serving dashboard stats from Redis cache');
      return res.json(JSON.parse(cached));
    }

    const [
      totalTrainers,
      totalInstitutes,
      totalCampaigns,
      totalImages,
      trainerAggregations,
    ] = await Promise.all([
      prisma.trainer.count(),
      prisma.institution.count(),
      prisma.campaign.count(),
      prisma.campaignImage.count(),
      prisma.trainer.aggregate({
        _sum: {
          totalStudentsTrained: true,
        },
      }),
    ]);

    // Baseline minimum is 6.12M + whatever is added dynamically.
    const baselineStudents = 6120000;
    const dynamicStudents = trainerAggregations._sum.totalStudentsTrained || 0;
    const totalStudentsTrained = baselineStudents + dynamicStudents;

    const stats = {
      totalTrainers,
      totalInstitutes,
      totalCampaigns,
      totalImages,
      totalStudentsTrained,
    };

    await setCache(CACHE_KEY, stats, CACHE_TTL);
    res.json(stats);
  } catch (error) {
    console.error('Error compiling dashboard stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
