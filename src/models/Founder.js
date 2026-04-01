const mongoose = require('mongoose');

const FounderSchema = new mongoose.Schema({
    name: { type: String, default: 'Dr. Suman Behmani' },
    role: { type: String, default: 'Relationship Psychologist | Founder' },
    message: { type: String, required: true },
    yearsExperience: { type: String, default: '10+' },
    image: { type: String, required: true },
    socials: {
        whatsapp: { type: String },
        linkedin: { type: String },
        instagram: { type: String },
        facebook: { type: String }
    },
    phone: { type: String, default: '9468224451' },
    location: { type: String, default: 'Reset Yourself Clinic, Near Landmark Tower, Phagwara, Punjab 144401' },
    email: { type: String, default: 'drsumanbehmani@gmail.com' },
    clinicalHours: { type: String, default: 'Mon – Sat | 10:00 AM – 7:00 PM' },
    mapUrl: { type: String, default: 'https://maps.google.com' },
    profileUrl: { type: String },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Founder', FounderSchema);
