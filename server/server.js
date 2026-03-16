const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const otpRoutes = require('./routes/otpRoutes');
const pledgeRoutes = require('./routes/pledgeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/otp', otpRoutes);
app.use('/api/pledge', pledgeRoutes);
app.use('/api/certificate', require('./routes/certificateRoutes'));

// Mount routes without /api prefix for Vercel compatibility when VITE_API_URL lacks /api
app.use('/otp', otpRoutes);
app.use('/pledge', pledgeRoutes);
app.use('/certificate', require('./routes/certificateRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

if (process.env.NODE_ENV !== 'production' || process.env.PORT) {
  app.listen(PORT, () => {
    console.log(`🚀 Pledge Server running on port ${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel
module.exports = app;
