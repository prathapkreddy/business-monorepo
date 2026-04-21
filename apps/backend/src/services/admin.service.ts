import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '90m';

export class AdminService {
    async login(email: string, password: string) {
        const admin = await prisma.adminUser.findUnique({
            where: { email },
        });

        if (!admin) {
            throw new Error('Invalid credentials');
        }

        // Note: In a real app, use bcrypt to compare hashed passwords.
        // For now, as per instruction to check against table.
        if (admin.password !== password) {
            throw new Error('Invalid credentials');
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
