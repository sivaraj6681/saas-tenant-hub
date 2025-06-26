const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/authRoutes');
const protectedRoute = require('./routes/protectedRoute');
const clientRoutes = require('./routes/clientRoutes');
const productRoutes = require('./routes/productRoutes');

// Load environment variables
dotenv.config();

const app = express();

// ✅ CORS Configuration (Allow Netlify frontend)
app.use(cors({
  origin: ['https://saas-tenant-hub.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoute);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");

  // Listen on port (Railway automatically assigns PORT or fallback to 5000)
 const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

}).catch(err => {
  console.error("❌ MongoDB connection failed:", err.message);
});
