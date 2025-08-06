"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parseXML_1 = require("../utils/parseXML");
const router = (0, express_1.Router)();
router.get('/categories/list', async (req, res) => {
    try {
        const products = await (0, parseXML_1.loadProducts)();
        const categories = Array.from(new Set(products.map((p) => p.category)));
        res.json(categories);
    }
    catch (err) {
        console.error('Ошибка при получении категорий:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});
router.get('/', async (req, res) => {
    const { category, search } = req.query;
    const products = await (0, parseXML_1.loadProducts)();
    const filtered = products.filter((p) => {
        if (category && p.category !== category)
            return false;
        if (search &&
            !p.name.toLowerCase().includes(search.toLowerCase()))
            return false;
        return true;
    });
    res.json(filtered);
});
router.get('/:id', async (req, res) => {
    const products = await (0, parseXML_1.loadProducts)();
    const found = products.find((p) => p.id === req.params.id);
    if (!found)
        return res.status(404).json({ message: 'Not found' });
    res.json(found);
});
exports.default = router;
