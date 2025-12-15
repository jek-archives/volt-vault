import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.use(authenticateToken); // Protect all routes below

// Get All Items
router.get('/', async (req, res) => {
    try {
        const items = await prisma.vaultItem.findMany({
            where: { userId: req.user.userId }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Item
router.post('/', async (req, res) => {
    try {
        const { type, name, username, encryptedData, iv, favorite } = req.body;

        const newItem = await prisma.vaultItem.create({
            data: {
                userId: req.user.userId,
                type,
                name,
                username,
                encryptedData,
                iv,
                favorite: favorite || false
            }
        });

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Item
router.delete('/:id', async (req, res) => {
    try {
        await prisma.vaultItem.delete({
            where: {
                id: req.params.id,
                userId: req.user.userId // Ensure ownership
            }
        });
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
