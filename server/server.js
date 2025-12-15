import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import vaultRoutes from './routes/vault.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from your Vercel URL
app.use(cors({
    origin: process.env.CLIENT_URL || '*', // Use env var or allow all for now
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);

app.get('/', (req, res) => {
    res.send('VoltVault API is running securely.');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
