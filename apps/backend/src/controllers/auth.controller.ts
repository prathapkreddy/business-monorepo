import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
    async googleSignin(req: Request, res: Response) {
        const { idToken } = req.body;
        try {
            const result = await authService.handleGoogleSignin(idToken);
            res.json({ token: idToken, user: result });
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            res.status(401).send('Unauthorized');
        }
    }

    async googleSignup(req: Request, res: Response) {
        const { idToken } = req.body;
        try {
            const result = await authService.handleGoogleSignup(idToken);
            res.json({ token: idToken, user: result });
        } catch (error) {
            res.status(401).send('Unauthorized');
        }
    }
}

export const authController = new AuthController();
