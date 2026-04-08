import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { auth as firebaseAuth } from './config/firebase';
import prisma from './lib/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
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

// Public Route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Protected Route
app.get('/protected', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    message: 'This is protected data from the backend',
    user: {
      uid: user.uid,
      email: user.email,
    },
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
