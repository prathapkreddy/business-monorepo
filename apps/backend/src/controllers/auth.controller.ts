import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
    async googleAuth(req: Request, res: Response) {
        const { idToken, referralCode } = req.body;
        try {
            const result = await authService.handleGoogleAuth(idToken, referralCode);
            res.json({ token: idToken, user: result });
        } catch (error) {
            console.error('Error during Google auth:', error);
            res.status(401).send('Unauthorized');
        }
    }
}

export const authController = new AuthController();
