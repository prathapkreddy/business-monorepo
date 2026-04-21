import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import appRoutes from './routes/app.routes';
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import bookingRoutes from './routes/booking.routes';
import homeRoutes from './routes/home.routes';
import contentRoutes from './routes/content.routes';
import adminRoutes from './routes/admin.routes';
import prisma from './lib/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', appRoutes);
app.use('/auth', authRoutes);
app.use('/customers', customerRoutes);
app.use('/bookings', bookingRoutes);
app.use('/home', homeRoutes);
app.use('/content', contentRoutes);
app.use('/admin', adminRoutes);

const startServer = async () => {
    try {
        try {
            await prisma.$connect();
            console.log('Successfully connected to the database');
        } catch (dbError) {
            console.error('Database connection failed, but starting server anyway:', dbError);
        }

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Fatal error starting the server:', error);
    }
};

startServer();
