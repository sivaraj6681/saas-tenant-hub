const Product = require('../models/Product');

// Create product for a client
exports.createProduct = async (req, res) => {
  const { name, description, category, price } = req.body;
  const { clientId } = req.params;

  try {
    const newProduct = new Product({
      user: req.user._id,          // ✅ FIXED
      client: clientId,
      name,
      category,
      description,
      price
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all products for a specific client
exports.getProductsByClient = async (req, res) => {
  const clientId = req.params.clientId;

  try {
    const products = await Product.find({
      user: req.user._id,          // ✅ FIXED
      client: clientId
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  const { name, description, category, price } = req.body;
  const { productId } = req.params;

  try {
    const product = await Product.findOneAndUpdate(
      { _id: productId, user: req.user._id },   // ✅ FIXED
      { name, description, category, price },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findOneAndDelete({
      _id: productId,
      user: req.user._id             // ✅ FIXED
    });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
