import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceName:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post('/', authenticate, bookingController.createBooking);

/**
 * @swagger
 * /bookings/current:
 *   get:
 *     summary: Get current bookings for the authenticated customer
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of current bookings
 */
router.get('/current', authenticate, bookingController.getCurrentBookings);

/**
 * @swagger
 * /bookings/past:
 *   get:
 *     summary: Get past bookings for the authenticated customer
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of past bookings
 */
router.get('/past', authenticate, bookingController.getPastBookings);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings for the authenticated customer
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/', authenticate, bookingController.getBookings);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   put:
 *     summary: Cancel a booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 */
router.put('/:id/cancel', authenticate, bookingController.cancelBooking);

export default router;
