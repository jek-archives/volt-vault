import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import vaultRoutes from './routes/vault.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from your Vercel URL (and others for debugging)
app.use(cors({
    origin: '*', // ⚠️ FOR DEBUGGING ONLY. Later, change this to your Vercel URL.
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log requests for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
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
