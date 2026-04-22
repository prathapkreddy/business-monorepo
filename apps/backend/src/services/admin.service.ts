import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET!;
const PASSWORD_HASH_KEY = process.env.PASSWORD_HASH_KEY!;
const JWT_EXPIRES_IN = '90m';

export class AdminService {
    private async hashPassword(password: string): Promise<string> {
        // Using PASSWORD_HASH_KEY as a pepper
        const pepperedPassword = password + PASSWORD_HASH_KEY;
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(pepperedPassword, salt);
    }

    private async comparePassword(password: string, hash: string): Promise<boolean> {
        const pepperedPassword = password + PASSWORD_HASH_KEY;
        return bcrypt.compare(pepperedPassword, hash);
    }

    async createAdmin(data: { email: string; name?: string; role?: string }) {
        // Requirement: Default password is four zeros '0000'
        const hashedPassword = await this.hashPassword('0000');
        return prisma.adminUser.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }

    async login(email: string, password: string) {
        const admin = await prisma.adminUser.findUnique({
            where: { email },
        });

        if (!admin) {
            throw new Error('Invalid credentials');
        }

        const isPasswordCorrect = await this.comparePassword(password, admin.password);

        if (!isPasswordCorrect) {
            throw new Error('Invalid credentials');
        }

        // Requirement: If password is '0000', force reset
        if (password === '0000') {
            const tempToken = jwt.sign(
                { id: admin.id, email: admin.email, role: admin.role, temp: true },
                JWT_SECRET,
                { expiresIn: '15m' }
            );
            return {
                resetPasswordRequired: true,
                message: 'Please reset your password to proceed.',
                email: admin.email,
                tempToken,
            };
        }

        const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        return {
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        };
    }

    async updatePassword(adminId: string, newPassword: string) {
        const hashedPassword = await this.hashPassword(newPassword);
        return prisma.adminUser.update({
            where: { id: adminId },
            data: { password: hashedPassword },
        });
    }

    async getProfile(adminId: string) {
        return prisma.adminUser.findUnique({
            where: { id: adminId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
    }
}

export const adminService = new AdminService();
