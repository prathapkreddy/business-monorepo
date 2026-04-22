import { Router } from 'express';
import { adminAuthController } from '../controllers/admin-auth.controller';
import { adminContentController } from '../controllers/admin-content.controller';
import { adminOfferController } from '../controllers/admin-offer.controller';
import { adminProfileController } from '../controllers/admin-profile.controller';
import { adminAuthenticate } from '../middlewares/admin.middleware';

const router = Router();

// Auth routes
router.post('/login', adminAuthController.login);

// Protected routes
router.use(adminAuthenticate);

// Profile
router.get('/profile', adminProfileController.getProfile);
router.post('/change-password', adminProfileController.changePassword);

// Content
router.get('/content', adminContentController.getAllContent);
router.put('/content/:id', adminContentController.updateContent);

// Offers
router.get('/offers', adminOfferController.getAllOffers);
router.post('/offers', adminOfferController.createOffer);

export default router;
