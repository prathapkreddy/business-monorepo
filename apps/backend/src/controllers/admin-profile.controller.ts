import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';

export class AdminProfileController {
    async changePassword(req: Request, res: Response) {
        const { currentPassword, newPassword } = req.body;
        const admin = (req as any).admin;
        try {
            // Re-authenticate with current password before changing
            const loginResult = await adminService.login(admin.email, currentPassword);

            // Even if loginResult.resetPasswordRequired is true, it means currentPassword matched '0000'
            // and it was a valid authentication attempt.

            await adminService.updatePassword(admin.id, newPassword);
            res.json({ message: 'Password updated successfully. Please login again.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Error updating password' });
        }
    }

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
