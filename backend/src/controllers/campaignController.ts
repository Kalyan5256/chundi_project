import { Request, Response } from 'express';
import prisma from '../config/db';
import { getCache, setCache, clearCachePattern } from '../config/redis';

const CACHE_TTL = 3600; // 1 hour

// --- GEOGRAPHY CONTROLLERS (States, Districts, Institutions) ---

export async function getStates(req: Request, res: Response) {
  try {
    const cacheKey = 'geo:states';
    const cached = await getCache(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const states = await prisma.state.findMany({
      orderBy: { name: 'asc' },
    });
    await setCache(cacheKey, states, CACHE_TTL);
    res.json(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createState(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'State name is required' });

    const state = await prisma.state.create({
      data: { name },
    });

    await clearCachePattern('geo:*');
    await clearCachePattern('stats:*');
    res.status(201).json(state);
  } catch (error) {
    console.error('Error creating state:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getDistricts(req: Request, res: Response) {
  try {
    const { stateId } = req.query;
    const cacheKey = `geo:districts:${stateId || 'all'}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const districts = await prisma.district.findMany({
      where: stateId ? { stateId: String(stateId) } : {},
      orderBy: { name: 'asc' },
      include: { state: true },
    });

    await setCache(cacheKey, districts, CACHE_TTL);
    res.json(districts);
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createDistrict(req: Request, res: Response) {
  try {
    const { name, stateId } = req.body;
    if (!name || !stateId) return res.status(400).json({ error: 'Name and stateId are required' });

    const district = await prisma.district.create({
      data: { name, stateId },
    });

    await clearCachePattern('geo:*');
    res.status(201).json(district);
  } catch (error) {
    console.error('Error creating district:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getInstitutions(req: Request, res: Response) {
  try {
    const { districtId } = req.query;
    const cacheKey = `geo:institutions:${districtId || 'all'}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const institutions = await prisma.institution.findMany({
      where: districtId ? { districtId: String(districtId) } : {},
      orderBy: { name: 'asc' },
      include: {
        district: {
          include: { state: true },
        },
      },
    });

    await setCache(cacheKey, institutions, CACHE_TTL);
    res.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createInstitution(req: Request, res: Response) {
  try {
    const { name, districtId } = req.body;
    if (!name || !districtId) return res.status(400).json({ error: 'Name and districtId are required' });

    const institution = await prisma.institution.create({
      data: { name, districtId },
    });

    await clearCachePattern('geo:*');
    await clearCachePattern('stats:*');
    res.status(201).json(institution);
  } catch (error) {
    console.error('Error creating institution:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// --- CAMPAIGN & GALLERY CONTROLLERS ---

export async function getCampaigns(req: Request, res: Response) {
  try {
    const { stateId, districtId, institutionId, year, trainerId } = req.query;

    // Build custom cache key based on query filters
    const cacheKey = `campaigns:filter:${stateId || ''}:${districtId || ''}:${institutionId || ''}:${year || ''}:${trainerId || ''}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log('Serving campaigns filter from Redis cache');
      return res.json(JSON.parse(cached));
    }

    // Build query filters dynamically
    const whereClause: any = {};

    if (year) {
      whereClause.year = parseInt(String(year));
    }
    if (trainerId) {
      whereClause.trainerId = String(trainerId);
    }
    if (institutionId) {
      whereClause.institutionId = String(institutionId);
    } else if (districtId) {
      whereClause.institution = {
        districtId: String(districtId),
      };
    } else if (stateId) {
      whereClause.institution = {
        district: {
          stateId: String(stateId),
        },
      };
    }

    const campaigns = await prisma.campaign.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        trainer: true,
        institution: {
          include: {
            district: {
              include: {
                state: true,
              },
            },
          },
        },
      },
    });

    await setCache(cacheKey, campaigns, CACHE_TTL);
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createCampaign(req: Request, res: Response) {
  try {
    const { year, institutionId, trainerId, story, imageUrls } = req.body;

    if (!year || !institutionId || !trainerId || !story) {
      return res.status(400).json({ error: 'Missing required campaign parameters' });
    }

    // Create campaign and associate images
    const campaign = await prisma.campaign.create({
      data: {
        year: parseInt(year),
        institutionId,
        trainerId,
        story,
        images: imageUrls && Array.isArray(imageUrls) ? {
          create: imageUrls.map((url: string) => ({ imageUrl: url })),
        } : undefined,
      },
      include: {
        images: true,
      },
    });

    // Invalidate caches
    await clearCachePattern('campaigns:*');
    await clearCachePattern('stats:*');
    await clearCachePattern('trainers:*'); // Since trainer's dynamic campaigns lists updated

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function updateCampaign(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { year, institutionId, trainerId, story, imageUrls } = req.body;

    const existingCampaign = await prisma.campaign.findUnique({ where: { id } });
    if (!existingCampaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Update main fields
    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        year: year ? parseInt(year) : undefined,
        institutionId,
        trainerId,
        story,
      },
    });

    // If new images provided, sync them
    if (imageUrls && Array.isArray(imageUrls)) {
      // Clear old images
      await prisma.campaignImage.deleteMany({
        where: { campaignId: id },
      });
      // Add new ones
      await prisma.campaignImage.createMany({
        data: imageUrls.map((url: string) => ({ campaignId: id, imageUrl: url })),
      });
    }

    const campaignWithImages = await prisma.campaign.findUnique({
      where: { id },
      include: { images: true },
    });

    // Invalidate caches
    await clearCachePattern('campaigns:*');
    await clearCachePattern('stats:*');
    await clearCachePattern('trainers:*');

    res.json(campaignWithImages);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function deleteCampaign(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const existingCampaign = await prisma.campaign.findUnique({ where: { id } });
    if (!existingCampaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    await prisma.campaign.delete({
      where: { id },
    });

    // Invalidate caches
    await clearCachePattern('campaigns:*');
    await clearCachePattern('stats:*');
    await clearCachePattern('trainers:*');

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
