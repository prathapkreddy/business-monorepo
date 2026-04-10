import { Request, Response } from 'express';

export class AppController {
    getHome(req: Request, res: Response) {
        res.send('Backend is running');
    }

    getProtected(req: Request, res: Response) {
        const user = (req as any).user;
        res.json({
            message: 'This is protected data from the backend',
            user: {
                uid: user.uid,
                email: user.email,
            },
            timestamp: new Date().toISOString(),
        });
    }
}

export const appController = new AppController();
