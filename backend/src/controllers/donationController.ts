import { Request, Response } from 'express';
import prisma from '../config/db';
import { getCache, setCache, clearCachePattern } from '../config/redis';

const CACHE_KEY = 'donation:settings';
const CACHE_TTL = 3600;

export async function getDonationSettings(req: Request, res: Response) {
  try {
    const cached = await getCache(CACHE_KEY);
    if (cached) return res.json(JSON.parse(cached));

    let settings = await prisma.donationSettings.findFirst();

    // If no settings exist yet, return a default template
    if (!settings) {
      settings = {
        id: 'default',
        qrCodeUrl: 'https://placehold.co/300x300?text=CES+NGO+UPI+QR',
        upiId: 'ces@upi',
        bankName: 'CES NGO Bank',
        accountNumber: '1234567890',
        ifscCode: 'NGO0001234',
        accountHolder: 'Chundi Educational Society',
        missionStatement: 'Your support empowers students for a drug-free future since 2009.',
      };
    }

    await setCache(CACHE_KEY, settings, CACHE_TTL);
    res.json(settings);
  } catch (error) {
    console.error('Error fetching donation settings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function updateDonationSettings(req: Request, res: Response) {
  try {
    const { qrCodeUrl, upiId, bankName, accountNumber, ifscCode, accountHolder, missionStatement } = req.body;

    let settings = await prisma.donationSettings.findFirst();

    if (settings) {
      settings = await prisma.donationSettings.update({
        where: { id: settings.id },
        data: {
          qrCodeUrl,
          upiId,
          bankName,
          accountNumber,
          ifscCode,
          accountHolder,
          missionStatement,
        },
      });
    } else {
      settings = await prisma.donationSettings.create({
        data: {
          qrCodeUrl: qrCodeUrl || '',
          upiId: upiId || '',
          bankName: bankName || '',
          accountNumber: accountNumber || '',
          ifscCode: ifscCode || '',
          accountHolder: accountHolder || '',
          missionStatement: missionStatement || '',
        },
      });
    }

    await clearCachePattern('donation:*');
    await clearCachePattern('stats:*');
    res.json(settings);
  } catch (error) {
    console.error('Error updating donation settings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
