// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const {
  createProduct,
  getProductsByClient,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Routes (scoped to each client)
router.post('/:clientId', authenticate, createProduct);                     // Create product for client
router.get('/client/:clientId', authenticate, getProductsByClient);         // List products of client
router.put('/:productId', authenticate, updateProduct);                     // Update product
router.delete('/:productId', authenticate, deleteProduct);                  // Delete product

module.exports = router;
