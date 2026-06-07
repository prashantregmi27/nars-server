const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Register all models
require('./models/index');

const contactRoutes = require('./routes/contactRoutes');
const careerRoutes = require('./routes/careerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const newsRoutes = require('./routes/newsRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({ origin: isProduction ? process.env.CORS_ORIGIN : 'http://localhost:5173' }));
app.use(express.json());
if (!isProduction) app.use(morgan('dev'));

app.use('/api/contact', contactRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/uploads', express.static('uploads'));

if (isProduction && !process.env.IS_RENDER) {
  const publicPath = path.join(__dirname, '..');
  app.use('/assets', express.static(path.join(publicPath, 'assets')));
  app.use('/images', express.static(path.join(publicPath, 'images')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
