import { Request, Response, NextFunction } from 'express';
import { auth as firebaseAuth } from '../config/firebase';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized');
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await firebaseAuth.verifyIdToken(idToken);
        (req as any).user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).send('Unauthorized');
    }
};
