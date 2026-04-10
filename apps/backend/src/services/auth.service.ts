import { auth as firebaseAuth } from '../config/firebase';
import prisma from '../lib/prisma';

export class AuthService {
    async verifyIdToken(idToken: string) {
        try {
            const decodedToken = await firebaseAuth.verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            console.error('Error verifying token:', error);
            throw new Error('Unauthorized');
        }
    }

    private async syncCustomerWithDb(decodedToken: any) {
        const { uid, email, name, picture, phone_number, email_verified } = decodedToken;

        const existingCustomer = await prisma.customer.findUnique({
            where: { id: uid },
        });

        if (existingCustomer) {
            return prisma.customer.update({
                where: { id: uid },
                data: {
                    lastLoginAt: new Date(),
                    email: email, // Email might change in some auth providers
                    photoUrl: picture,
                    emailVerified: email_verified,
                },
            });
        }

        return prisma.customer.create({
            data: {
                id: uid,
                email: email!,
                name: name,
                photoUrl: picture,
                phoneNumber: phone_number,
                emailVerified: email_verified,
                lastLoginAt: new Date(),
            },
        });
    }

    async handleGoogleSignin(idToken: string) {
        const decodedToken = await this.verifyIdToken(idToken);
        const customer = await this.syncCustomerWithDb(decodedToken);
        return { ...decodedToken, customer };
    }

    async handleGoogleSignup(idToken: string) {
        const decodedToken = await this.verifyIdToken(idToken);
        const customer = await this.syncCustomerWithDb(decodedToken);
        return { ...decodedToken, customer };
    }
}

export const authService = new AuthService();
