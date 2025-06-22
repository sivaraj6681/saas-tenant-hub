const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  category: {
    type: String, // e.g., "Analytics", "Security", "Support"
    required: [true, 'Product category is required']
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'Product price is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
