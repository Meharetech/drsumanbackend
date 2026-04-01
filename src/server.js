require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Auto-create Uploads Directory for Clinical Assets
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('📁 Created Uploads Directory for Clinical Imagery.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Assets (Clinical Photos, Gallery Images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB Connection Logic
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Clinical Database (MongoDB) Connected Successfully.'))
  .catch((err) => console.error('❌ Database Connection Error: ', err));

// Clinical API Routing
app.use('/api/auth', require('./routes/auth'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/category', require('./routes/category'));
app.use('/api/founder', require('./routes/founder'));
app.use('/api/enquiry', require('./routes/enquiry'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date(), message: 'Reset Yourself API is healthy.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Clinical Server running on port ${PORT}`);
});
