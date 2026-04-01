const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// @route   POST api/auth/login
// @desc    Secure administrative login for clinical access
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        let admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: '❌ Invalid clinical credentials.' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: '❌ Invalid clinical credentials.' });
        }

        // Update last login
        admin.lastLogin = Date.now();
        await admin.save();

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, admin: { id: admin._id, username: admin.username } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/auth/register-initial
// @desc    Setup initial administrative credentials (locked in production)
router.post('/register-initial', async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Forbidden' });
        
        const { username, password, email } = req.body;
        const admin = new Admin({ username, password, email });
        await admin.save();
        res.status(201).json({ message: '✅ Primary Admin registered successfully.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
