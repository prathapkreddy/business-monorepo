import prisma from '../lib/prisma';

export const homeService = {
    async getHomeData() {
        try {
            const [allServices, offers] = await Promise.all([
                prisma.service.findMany({
                    include: {
                        details: true,
                    },
                }),
                prisma.offer.findMany({
                    include: {
                        details: true,
                    },
                }),
            ]);

            // Fallback to dummy data if database is empty to ensure frontend still shows something
            const finalServices = allServices.length > 0 ? allServices : [{}];
            const finalOffers = offers.length > 0 ? offers : [{}];

            return {
                services: finalServices,
                offers: finalOffers,
                recentlyViewed: [], // Placeholder for now
            };
        } catch (error) {
            console.error('Error fetching home data:', error);
            throw error;
        }
    },
    async getOfferDetails(id: string) {
        return prisma.offer.findUnique({
            where: { id },
            include: {
                details: true,
            },
        });
    },
    async getServiceDetails(id: string) {
        return prisma.service.findUnique({
            where: { id },
            include: {
                details: true,
            },
        });
    },
};
