import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
    async googleSignin(req: Request, res: Response) {
        const { idToken } = req.body;
        try {
            const decodedToken = await authService.handleGoogleSignin(idToken);
            res.json({ success: true, user: decodedToken });
        } catch (error) {
            res.status(401).send('Unauthorized');
        }
    }

    async googleSignup(req: Request, res: Response) {
        const { idToken } = req.body;
        try {
            const decodedToken = await authService.handleGoogleSignup(idToken);
            res.json({ success: true, user: decodedToken });
        } catch (error) {
            res.status(401).send('Unauthorized');
        }
    }
}

export const authController = new AuthController();
