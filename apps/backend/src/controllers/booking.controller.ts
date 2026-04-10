import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';

export class BookingController {
    async createBooking(req: Request, res: Response) {
        try {
            const uid = (req as any).user.uid;
            const { serviceName, date } = req.body;

            if (!serviceName || !date) {
                return res.status(400).json({ error: 'serviceName and date are required' });
            }

            const booking = await bookingService.createBooking(uid, { serviceName, date });
            res.status(201).json(booking);
        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(500).json({ error: 'Failed to create booking' });
        }
    }

    async getBookings(req: Request, res: Response) {
        try {
            const uid = (req as any).user.uid;
            const bookings = await bookingService.getCustomerBookings(uid);
            res.json(bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ error: 'Failed to fetch bookings' });
        }
    }

    async getCurrentBookings(req: Request, res: Response) {
        try {
            const uid = (req as any).user.uid;
            const bookings = await bookingService.getCurrentBookings(uid);
            res.json(bookings);
        } catch (error) {
            console.error('Error fetching current bookings:', error);
            res.status(500).json({ error: 'Failed to fetch current bookings' });
        }
    }

    async getPastBookings(req: Request, res: Response) {
        try {
            const uid = (req as any).user.uid;
            const bookings = await bookingService.getPastBookings(uid);
            res.json(bookings);
        } catch (error) {
            console.error('Error fetching past bookings:', error);
            res.status(500).json({ error: 'Failed to fetch past bookings' });
        }
    }

    async cancelBooking(req: Request, res: Response) {
        try {
            const uid = (req as any).user.uid;
            const { id } = req.params;

            const result = await bookingService.cancelBooking(String(id), uid);
            if (result.count === 0) {
                return res.status(404).json({ error: 'Booking not found or not authorized' });
            }

            res.json({ success: true, message: 'Booking cancelled' });
        } catch (error) {
            console.error('Error cancelling booking:', error);
            res.status(500).json({ error: 'Failed to cancel booking' });
        }
    }
}

export const bookingController = new BookingController();
