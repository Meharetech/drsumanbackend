const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const Founder = require('../models/Founder');

// @route   GET api/founder
// @desc    Get the founder's clinical message and profile
router.get('/', async (req, res) => {
    try {
        let founder = await Founder.findOne();
        if (!founder) {
            // Initial data if none exists
            founder = new Founder({
                message: 'Welcome to Reset Yourself. We are here to support your mental wellness journey with clinical clarity and heartfelt care.',
                image: '/assets/herosection.png'
            });
            await founder.save();
        }
        res.json(founder);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT api/founder
// @desc    Update your clinical founder presence
router.put('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'messageImage', maxCount: 1 }]), async (req, res) => {
    try {
        const { name, role, message, yearsExperience, whatsapp, linkedin, instagram, facebook, profileUrl, location, email, clinicalHours, mapUrl, phone } = req.body;
        
        const updateData = {
            $set: {
                name,
                role,
                message,
                yearsExperience,
                "socials.whatsapp": whatsapp,
                "socials.linkedin": linkedin,
                "socials.instagram": instagram,
                "socials.facebook": facebook,
                profileUrl,
                location,
                email,
                clinicalHours,
                mapUrl,
                phone,
                updatedAt: Date.now()
            }
        };

        if (req.files && req.files['image']) {
            updateData.$set.image = `/uploads/${req.files['image'][0].filename}`;
        }

        if (req.files && req.files['messageImage']) {
            updateData.$set.messageImage = `/uploads/${req.files['messageImage'][0].filename}`;
        }

        let founder = await Founder.findOneAndUpdate({}, updateData, { new: true, upsert: true });
        res.json(founder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
