const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const Gallery = require('../models/Gallery');
const fs = require('fs');
const path = require('path');

// @route   GET api/gallery
// @desc    Get all clinical visuals
router.get('/', async (req, res) => {
    try {
        const gallery = await Gallery.find()
            .populate('category', 'name')
            .sort({ createdAt: -1 });
        res.json(gallery);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/gallery
// @desc    Upload a new clinical visual asset
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, category, altText } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: '❌ Image file is required for gallery upload.' });
        }

        const newVisual = new Gallery({
            title,
            url: `/uploads/${req.file.filename}`,
            category,
            altText,
            size: req.file.size,
            format: req.file.mimetype
        });

        await newVisual.save();
        res.status(201).json(newVisual);
    } catch (err) {
        console.error('❌ Error uploading visual asset: ', err);
        res.status(400).json({ message: err.message });
    }
});

// @route   PUT api/gallery/:id
// @desc    Update a clinical visual metadata
router.put('/:id', async (req, res) => {
    try {
        const { title, category } = req.body;
        const visual = await Gallery.findByIdAndUpdate(
            req.params.id, 
            { title, category }, 
            { new: true }
        ).populate('category', 'name');
        
        if (!visual) return res.status(404).json({ message: 'Visual not found' });
        res.json(visual);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE api/gallery/:id
// @desc    Delete a clinical visual asset
router.delete('/:id', async (req, res) => {
    try {
        const visual = await Gallery.findById(req.params.id);
        if (!visual) {
            return res.status(404).json({ message: 'Visual not found' });
        }

        // Delete the physical file from the server
        const filePath = path.join(__dirname, '../../', visual.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await visual.deleteOne();
        res.json({ message: 'Visual asset removed' });
    } catch (err) {
        console.error('❌ Error deleting visual asset: ', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
