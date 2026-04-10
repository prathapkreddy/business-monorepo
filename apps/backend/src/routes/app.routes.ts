import { Router } from 'express';
import { appController } from '../controllers/app.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns the home page
 *     responses:
 *       200:
 *         description: Hello Message
 */
router.get('/', appController.getHome);

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Returns a protected message
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Protected message
 *       401:
 *         description: Unauthorized
 */
router.get('/protected', authenticate, appController.getProtected);

export default router;
