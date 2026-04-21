import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export class AdminOfferController {
    async getAllOffers(req: Request, res: Response) {
        try {
            const offers = await prisma.offer.findMany({
                include: { details: true },
            });
            res.json(offers);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching offers' });
        }
    }

    async createOffer(req: Request, res: Response) {
        const { title, subtitle, code, color, details } = req.body;
        try {
            const offer = await prisma.offer.create({
                data: {
                    title,
                    subtitle,
                    code,
                    color,
                    details: details ? { create: { content: details } } : undefined,
                },
                include: { details: true },
            });
            res.json(offer);
        } catch (error) {
            res.status(500).json({ message: 'Error creating offer' });
        }
    }
}

export const adminOfferController = new AdminOfferController();
