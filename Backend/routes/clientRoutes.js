const express = require('express');
const router = express.Router();

const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} = require('../controllers/clientController');

const authenticate = require('../middleware/authMiddleware');
const { isowner } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(authenticate);

// Only owner can create clients
router.post('/', isowner, createClient);

// All authenticated users can view clients
router.get('/', getClients);
router.get('/:id', getClientById);

// Only owner can update or delete
router.put('/:id', isowner, updateClient);
router.delete('/:id', isowner, deleteClient);

module.exports = router;
