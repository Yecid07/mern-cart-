import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';
import messageRoutes from './routes/message.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //to parse JSON data from request body

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Cart Course API v2.0 is running',
        env: process.env.NODE_ENV || 'development',
        versions: ['v1 (/api)', 'v2 (/api/v2)'],
    });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// New versioned endpoints (v2)
app.use('/api/v2/products', productRoutes);
app.use('/api/v2/users', userRoutes);
app.use('/api/v2/orders', orderRoutes);
app.use('/api/v2/mensaje', messageRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log('Server started at http://localhost:' + PORT);
});
