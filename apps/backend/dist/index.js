"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const app_routes_1 = __importDefault(require("./routes/app.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const home_routes_1 = __importDefault(require("./routes/home.routes"));
const content_routes_1 = __importDefault(require("./routes/content.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const prisma_1 = __importDefault(require("./lib/prisma"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Routes
app.use('/', app_routes_1.default);
app.use('/auth', auth_routes_1.default);
app.use('/customers', customer_routes_1.default);
app.use('/bookings', booking_routes_1.default);
app.use('/home', home_routes_1.default);
app.use('/content', content_routes_1.default);
app.use('/admin', admin_routes_1.default);
const startServer = async () => {
    try {
        try {
            await prisma_1.default.$connect();
            console.log('Successfully connected to the database');
        }
        catch (dbError) {
            console.error('Database connection failed, but starting server anyway:', dbError);
        }
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
        });
    }
    catch (error) {
        console.error('Fatal error starting the server:', error);
    }
};
startServer();
