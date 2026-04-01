const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// @route   GET api/category
// @desc    Get all categories for a specific type (blog/gallery)
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const query = type ? { type } : {};
        const categories = await Category.find(query).sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/category
// @desc    Create a new clinical category
router.post('/', async (req, res) => {
    try {
        const { name, type } = req.body;
        const category = new Category({ name, type });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE api/category/:id
// @desc    Remove a specific clinical category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: '✅ Category removed successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
