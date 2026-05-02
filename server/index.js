require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const quoteRoutes = require('./routes/quotes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB (local)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(`${process.env.REACT_APP_API_URL}/api/auth`, authRoutes);
app.use(`${process.env.REACT_APP_API_URL}/api/quotes`, quoteRoutes);

app.get(`${process.env.REACT_APP_API_URL}/api/health`, (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
