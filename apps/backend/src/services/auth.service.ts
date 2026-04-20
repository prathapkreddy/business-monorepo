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

    private async generateUniqueReferralCode(name: string): Promise<string> {
        const base = (name || 'USER').toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4);
        let code = '';
        let isUnique = false;

        while (!isUnique) {
            const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
            code = `${base}${random}`;
            const existing = await prisma.customer.findUnique({
                where: { referralCode: code },
            });
            if (!existing) {
                isUnique = true;
            }
        }
        return code;
    }

    private async syncCustomerWithDb(decodedToken: any, providedReferralCode?: any) {
        const { uid, email, name, picture, phone_number, email_verified } = decodedToken;

        // Ensure providedReferralCode is a string and not an object
        const referralCodeString = typeof providedReferralCode === 'string' ? providedReferralCode : undefined;

        let existingCustomer = await prisma.customer.findUnique({
            where: { id: uid },
        });

        if (!existingCustomer && email) {
            existingCustomer = await prisma.customer.findUnique({
                where: { email: email },
            });
        }

        if (existingCustomer) {
            if (existingCustomer.id !== uid) {
                return prisma.$transaction(async (tx) => {
                    await tx.customer.delete({
                        where: { id: existingCustomer!.id },
                    });

                    let referralCode = existingCustomer!.referralCode;
                    if (!referralCode) {
                        referralCode = await this.generateUniqueReferralCode(name || existingCustomer!.name || 'USER');
                    }

                    return tx.customer.create({
                        data: {
                            id: uid,
                            email: email!,
                            name: name || existingCustomer!.name,
                            photoUrl: picture || existingCustomer!.photoUrl,
                            phoneNumber: phone_number || existingCustomer!.phoneNumber,
                            emailVerified: email_verified,
                            referralCode: referralCode,
                            referredByCode: existingCustomer!.referredByCode,
                            lastLoginAt: new Date(),
                        },
                    });
                });
            }

            // If user exists but somehow doesn't have a referral code, generate one
            if (!existingCustomer.referralCode) {
                return prisma.customer.update({
                    where: { id: uid },
                    data: {
                        lastLoginAt: new Date(),
                        email: email,
                        photoUrl: picture,
                        emailVerified: email_verified,
                        referralCode: await this.generateUniqueReferralCode(name || existingCustomer.name || 'USER'),
                    },
                });
            }

            return prisma.customer.update({
                where: { id: uid },
                data: {
                    lastLoginAt: new Date(),
                    email: email,
                    photoUrl: picture,
                    emailVerified: email_verified,
                },
            });
        }

        // Validate provided referral code
        let validReferredByCode: string | undefined = undefined;
        if (referralCodeString) {
            const referrer = await prisma.customer.findUnique({
                where: { referralCode: referralCodeString },
            });
            if (referrer) {
                validReferredByCode = referralCodeString;
            }
        }

        const newReferralCode = await this.generateUniqueReferralCode(name || 'USER');

        return prisma.customer.create({
            data: {
                id: uid,
                email: email!,
                name: name,
                photoUrl: picture,
                phoneNumber: phone_number,
                emailVerified: email_verified,
                referralCode: newReferralCode,
                referredByCode: validReferredByCode,
                lastLoginAt: new Date(),
            },
        });
    }

    async handleGoogleAuth(idToken: string, referralCode?: string) {
        const decodedToken = await this.verifyIdToken(idToken);
        const customer = await this.syncCustomerWithDb(decodedToken, referralCode);
        return { ...decodedToken, customer };
    }
}

export const authService = new AuthService();
