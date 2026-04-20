import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Google authentication (upsert)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *               referralCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auth successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 */
router.post('/google', authController.googleAuth);

export default router;
