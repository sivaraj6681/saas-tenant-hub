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
const { isOwner } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(authenticate);

// Only Owner can create clients
router.post('/', isOwner, createClient);

// All authenticated users can view clients
router.get('/', getClients);
router.get('/:id', getClientById);

// Only Owner can update or delete
router.put('/:id', isOwner, updateClient);
router.delete('/:id', isOwner, deleteClient);

module.exports = router;
