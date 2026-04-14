import { auth as firebaseAuth } from '../config/firebase';
import prisma from '../lib/prisma';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.EXPO_PUBLIC_WEB_CLIENT_ID);

export class AuthService {
    async verifyIdToken(idToken: string) {
        try {
            // Check if the token is a Google ID token by verifying with google-auth-library
            // First, try to verify as a Google ID token
            try {
                const ticket = await client.verifyIdToken({
                    idToken: idToken,
                    audience: [
                        process.env.EXPO_PUBLIC_WEB_CLIENT_ID!,
                        process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID!,
                    ].filter(Boolean),
                });
                const payload = ticket.getPayload();
                if (payload) {
                    return {
                        uid: payload.sub,
                        email: payload.email,
                        name: payload.name,
                        picture: payload.picture,
                        email_verified: payload.email_verified,
                        ...payload,
                    };
                }
            } catch (googleError) {
                console.log('Not a valid Google ID token, trying Firebase...');
            }

            // Fallback to Firebase ID token verification
            const decodedToken = await firebaseAuth.verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            console.error('Error verifying token:', error);
            throw new Error('Unauthorized');
        }
    }

    private async syncCustomerWithDb(decodedToken: any) {
        const { uid, email, name, picture, phone_number, email_verified } = decodedToken;

        // Try to find the customer by id first (Firebase UID)
        let existingCustomer = await prisma.customer.findUnique({
            where: { id: uid },
        });

        // If not found by id, try to find by email (for cases where user might have used a different auth provider with same email)
        if (!existingCustomer && email) {
            existingCustomer = await prisma.customer.findUnique({
                where: { email: email },
            });
        }

        if (existingCustomer) {
            // Update existing customer, ensuring the ID is correct
            // If we found them by email but with a different ID, we should update the ID to the current UID
            // However, Prisma doesn't allow updating the @id field directly.
            // If the UIDs differ, we delete the old record and create a new one with the correct UID.
            // This is safer than attempting to update the primary key.
            
            if (existingCustomer.id !== uid) {
                // To avoid unique constraint violation on email, we can do this in a transaction or simply delete first
                // Use a transaction to ensure atomicity
                return prisma.$transaction(async (tx) => {
                    await tx.customer.delete({
                        where: { id: existingCustomer!.id },
                    });

                    return tx.customer.create({
                        data: {
                            id: uid,
                            email: email!,
                            name: name || existingCustomer!.name,
                            photoUrl: picture || existingCustomer!.photoUrl,
                            phoneNumber: phone_number || existingCustomer!.phoneNumber,
                            emailVerified: email_verified,
                            lastLoginAt: new Date(),
                        },
                    });
                });
            }

            return prisma.customer.update({
                where: { id: uid },
                data: {
                    lastLoginAt: new Date(),
                    email: email, 
                    photoUrl: picture,
                    emailVerified: email_verified,
                    name: name || existingCustomer.name,
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
