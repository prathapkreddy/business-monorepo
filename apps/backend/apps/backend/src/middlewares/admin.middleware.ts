import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const adminAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).admin = decoded;
        next();
    } catch (error) {
        console.error('Error verifying admin token:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
