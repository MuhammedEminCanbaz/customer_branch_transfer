const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();

// Yardımcı: JSON dosyası oku/yaz
const readJson = async (filename) => {
    const filePath = path.join(__dirname, '..', 'data', filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
};

const writeJson = async (filename, content) => {
    const filePath = path.join(__dirname, '..', 'data', filename);
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
};

// GET /api/customers
router.get('/customers', async (req, res) => {
    try {
        const customers = await readJson('customers.json');
        res.json(customers);
    } catch {
        res.status(500).json({ error: 'Müşteri verisi okunamadı' });
    }
});

// PATCH /api/customers/:id
router.patch('/customers/:id', async (req, res) => {
    try {
        const customers = await readJson('customers.json');
        const index = customers.findIndex(c => c.id === req.params.id);

        if (index === -1) return res.status(404).json({ error: 'Müşteri bulunamadı' });

        customers[index] = {
            ...customers[index],
            ...req.body
        };

        await writeJson('customers.json', customers);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Güncelleme sırasında hata oluştu' });
    }
});

// GET /api/branches
router.get('/branches', async (req, res) => {
    try {
        const branches = await readJson('branches.json');
        res.json(branches);
    } catch {
        res.status(500).json({ error: 'Şube verisi okunamadı' });
    }
});

// GET /api/services
router.get('/services', async (req, res) => {
    try {
        const services = await readJson('services.json');
        res.json(services);
    } catch {
        res.status(500).json({ error: 'Servis verisi okunamadı' });
    }
});

// GET /api/transfers
router.get('/transfers', async (req, res) => {
    try {
        const transfers = await readJson('transferLogs.json');
        res.json(transfers);
    } catch {
        res.status(500).json({ error: 'Transfer logları okunamadı' });
    }
});

module.exports = router;
