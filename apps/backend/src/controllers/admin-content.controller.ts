import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export class AdminContentController {
    async getAllContent(req: Request, res: Response) {
        try {
            const content = await prisma.cMSPageContent.findMany();
            res.json(content);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching content' });
        }
    }

    async updateContent(req: Request, res: Response) {
        const { id } = req.params;
        const { content } = req.body;
        try {
            const updated = await prisma.cMSPageContent.update({
                where: { id: id as string },
                data: { content },
            });
            res.json(updated);
        } catch (error) {
            res.status(500).json({ message: 'Error updating content' });
        }
    }
}

export const adminContentController = new AdminContentController();
