const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const protectedRoute = require('./routes/protectedRoute');
const clientRoutes = require('./routes/clientRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();

// ✅ Allow frontend (React at localhost:3001) and enable credentials
app.use(cors({
  origin: ['https://saas-tenant-hub-production.up.railway.app/'],
  credentials: true
}));


// Middleware to parse JSON bodies
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
  console.log("✅MongoDB connected");
  app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
}).catch(err => {
  console.error("❌ MongoDB connection failed:", err.message);
});
