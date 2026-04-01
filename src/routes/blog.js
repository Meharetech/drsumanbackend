const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const Blog = require('../models/Blog');

// @route   GET api/blog
// @desc    Get all clinical blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('category', 'name')
            .sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/blog
// @desc    Add a new clinical blog (with thumbnail upload)
router.post('/', upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, summary, content, category, author, status } = req.body;
        
        // Use the uploaded filename or a placeholder if no file
        const thumbnail = req.file ? `/uploads/${req.file.filename}` : 'assets/placeholder-blog.png';

        const newBlog = new Blog({
            title,
            summary,
            content,
            category,
            thumbnail,
            author,
            status
        });

        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        console.error('❌ Error publishing blog: ', err);
        res.status(400).json({ message: err.message });
    }
});

// @route   PUT api/blog/:id
// @desc    Update an existing clinical blog
router.put('/:id', upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, summary, content, category, status } = req.body;
        const updateData = { title, summary, content, category, status, updatedAt: Date.now() };

        if (req.file) {
            updateData.thumbnail = `/uploads/${req.file.filename}`;
        }

        const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        console.error('❌ Error updating blog: ', err);
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE api/blog/:id
// @desc    Remove a specific clinical article
router.delete('/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: '✅ Clinical article removed successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
