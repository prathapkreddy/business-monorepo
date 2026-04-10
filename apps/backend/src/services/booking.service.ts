import prisma from '../lib/prisma';

export class BookingService {
    async createBooking(customerId: string, data: { serviceName: string; date: string }) {
        return prisma.booking.create({
            data: {
                customerId,
                serviceName: data.serviceName,
                date: new Date(data.date),
            },
        });
    }

    async getCustomerBookings(customerId: string) {
        return prisma.booking.findMany({
            where: { customerId },
            orderBy: { date: 'asc' },
        });
    }

    async getCurrentBookings(customerId: string) {
        return prisma.booking.findMany({
            where: {
                customerId,
                date: { gte: new Date() },
                status: { not: 'CANCELLED' },
            },
            orderBy: { date: 'asc' },
        });
    }

    async getPastBookings(customerId: string) {
        return prisma.booking.findMany({
            where: {
                customerId,
                OR: [{ date: { lt: new Date() } }, { status: 'CANCELLED' }],
            },
            orderBy: { date: 'desc' },
        });
    }

    async cancelBooking(bookingId: string, customerId: string) {
        return prisma.booking.updateMany({
            where: {
                id: bookingId,
                customerId: customerId, // Security: ensure it belongs to the user
            },
            data: { status: 'CANCELLED' },
        });
    }
}

export const bookingService = new BookingService();
