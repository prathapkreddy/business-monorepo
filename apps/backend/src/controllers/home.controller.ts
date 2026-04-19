import { Request, Response } from 'express';
import { homeService } from '../services/home.service';

export const homeController = {
    async getHomeData(req: Request, res: Response) {
        try {
            const data = await homeService.getHomeData();
            res.json(data);
        } catch (error) {
            console.error('Error in getHomeData controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async getOfferDetails(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (typeof id !== 'string') {
                return res.status(400).json({ error: 'Invalid offer ID' });
            }
            const offer = await homeService.getOfferDetails(id);
            if (!offer) {
                return res.status(404).json({ error: 'Offer not found' });
            }
            res.json(offer);
        } catch (error) {
            console.error('Error in getOfferDetails controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async getServiceDetails(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (typeof id !== 'string') {
                return res.status(400).json({ error: 'Invalid service ID' });
            }
            const service = await homeService.getServiceDetails(id);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json(service);
        } catch (error) {
            console.error('Error in getServiceDetails controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
