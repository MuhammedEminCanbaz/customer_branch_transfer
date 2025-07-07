const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();

// Yardımcı fonksiyon: Dosya oku
const readJson = async (filename) => {
    const filePath = path.join(__dirname, '..', 'data', filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
};

// GET /api/customers
router.get('/customers', async (req, res) => {
    try {
        const customers = await readJson('customers.json');
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Müşteri verisi okunamadı' });
    }
});

// GET /api/branches
router.get('/branches', async (req, res) => {
    try {
        const branches = await readJson('branches.json');
        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: 'Şube verisi okunamadı' });
    }
});

// GET /api/services
router.get('/services', async (req, res) => {
    try {
        const services = await readJson('services.json');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Servis verisi okunamadı' });
    }
});

// GET /api/transfers
router.get('/transfers', async (req, res) => {
    try {
        const transfers = await readJson('transferLogs.json');
        res.json(transfers);
    } catch (error) {
        res.status(500).json({ error: 'Transfer logları okunamadı' });
    }
});

module.exports = router;
