const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// POST /api/enquiry — Submit a new booking enquiry (public)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, serviceType, message } = req.body;
        if (!name || !email || !phone || !serviceType) {
            return res.status(400).json({ message: 'Please fill all required fields.' });
        }
        const enquiry = new Enquiry({ name, email, phone, serviceType, message });
        await enquiry.save();
        res.status(201).json({ message: '✅ Booking request submitted successfully!', enquiry });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/enquiry — Get all enquiries (admin)
router.get('/', async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/enquiry/:id/status — Mark as read/replied (admin)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(enquiry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/enquiry/:id — Delete an enquiry (admin)
router.delete('/:id', async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        res.json({ message: '🗑️ Enquiry deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
