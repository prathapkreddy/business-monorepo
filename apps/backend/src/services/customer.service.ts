import prisma from '../lib/prisma';

export class CustomerService {
    async updateProfile(uid: string, data: { name?: string; phoneNumber?: string }) {
        return prisma.customer.update({
            where: { id: uid },
            data: {
                name: data.name,
                phoneNumber: data.phoneNumber,
            },
        });
    }

    async getProfile(uid: string) {
        return prisma.customer.findUnique({
            where: { id: uid },
        });
    }

    async deleteAccount(uid: string) {
        // According to GDPR/Privacy requirements, we should delete all associated data
        // Delete bookings first then the customer
        await prisma.booking.deleteMany({
            where: { customerId: uid },
        });

        return prisma.customer.delete({
            where: { id: uid },
        });
    }
}

export const customerService = new CustomerService();
