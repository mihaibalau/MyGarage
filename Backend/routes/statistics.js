// routes/statistics.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/expiring-insurance', async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(today.getDate() + 30);
        
        const results = await prisma.$queryRaw`
            SELECT 
                carBrand, 
                COUNT(*) as count 
            FROM Car 
            WHERE insuranceValidity > ${today} 
                AND insuranceValidity < ${thirtyDaysLater} 
            GROUP BY carBrand 
            ORDER BY count DESC
        `;
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
