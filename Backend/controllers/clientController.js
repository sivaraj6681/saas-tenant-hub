// backend/controllers/clientController.js
const Client = require('../models/Client');

// Create a client
exports.createClient = async (req, res) => {
  const { name, company, email, phone, notes, status, subscriptionPlan } = req.body;
  try {
    const newClient = new Client({
      user: req.user._id,
      name,
      company,
      email,
      phone,
      notes,
      status: status || 'Active',
      subscriptionPlan: subscriptionPlan || 'Basic'
    });
    await newClient.save();
    res.status(201).json({ message: 'Client created successfully', client: newClient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ user: req.user._id });
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single client
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, user: req.user._id });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  const { name, company, email, phone, notes, status, subscriptionPlan } = req.body;
  try {
    const updatedClient = await Client.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, company, email, phone, notes, status, subscriptionPlan },
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found or unauthorized' });
    }
    res.status(200).json({ message: 'Client updated', client: updatedClient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found or unauthorized' });
    }
    res.status(200).json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
