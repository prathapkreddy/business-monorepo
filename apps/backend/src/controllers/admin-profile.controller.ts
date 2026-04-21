import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';

export class AdminProfileController {
    async getProfile(req: Request, res: Response) {
        const admin = (req as any).admin;
        try {
            const profile = await adminService.getProfile(admin.id);
            if (!profile) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            res.json(profile);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching profile' });
        }
    }
}

export const adminProfileController = new AdminProfileController();
