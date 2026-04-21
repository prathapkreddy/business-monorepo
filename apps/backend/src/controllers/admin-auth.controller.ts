import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';

export class AdminAuthController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const result = await adminService.login(email, password);
            res.json(result);
        } catch (error: any) {
            console.error('Admin login error:', error);
            res.status(401).json({ message: error.message || 'Unauthorized' });
        }
    }
}

export const adminAuthController = new AdminAuthController();
