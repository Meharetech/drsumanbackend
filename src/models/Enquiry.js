const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true },
    phone:       { type: String, required: true, trim: true },
    serviceType: { type: String, required: true },
    message:     { type: String, default: '' },
    status:      { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
    createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', EnquirySchema);
