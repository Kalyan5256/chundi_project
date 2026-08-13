import { Request, Response } from 'express';
import prisma from '../config/db';

export async function submitContactForm(req: Request, res: Response) {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields (name, email, phone, message) are required' });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    res.status(201).json({ message: 'Contact form submitted successfully', submission });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getContactSubmissions(req: Request, res: Response) {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(submissions);
  } catch (error) {
    console.error('Fetch contact submissions error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
