import { Request, Response } from 'express';
import { customerService } from '../services/customer.service';

export class CustomerController {
    async getProfile(req: Request, res: Response) {
        try {
            const uid = (req as any).user.uid;
            const customer = await customerService.getProfile(uid);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            res.json(customer);
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const uid = (req as any).user.uid;
            const { name, phoneNumber } = req.body;

            const updatedCustomer = await customerService.updateProfile(uid, {
                name,
                phoneNumber,
            });

            res.json(updatedCustomer);
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    async deleteAccount(req: Request, res: Response) {
        try {
            const uid = (req as any).user.uid;

            // Should probably also delete from Firebase, but as a backend API
            // we primarily manage our database.
            await customerService.deleteAccount(uid);

            res.json({
                success: true,
                message: 'Account and associated data deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting account:', error);
            res.status(500).json({ error: 'Failed to delete account' });
        }
    }
}

export const customerController = new CustomerController();
