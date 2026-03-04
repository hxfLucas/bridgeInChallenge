"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    res.json({ message: 'Contents root - list placeholder' });
});
router.get('/:id', async (req, res) => {
    res.json({ id: req.params.id, content: 'Example content' });
});
exports.default = router;
