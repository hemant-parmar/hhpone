// here we will use the router provided by the express package
const express = require('express');
const router = express.Router();

const ClientController = require('../controllers/clients');

// const checkAuth = require('../middleware/check-auth');

// NOTE that requests reaching this file are already filtered for having '/api/clients' prefix

// POST - to add a new client
router.post('', ClientController.addClient);

// GET - to fetch all clients
router.get('', ClientController.getClients);

// GET - to fetch just id and compNames
router.get('/clientNames', ClientController.getClientNames);

// // GET - a client
router.get('/:id', ClientController.getClient);

// // PUT - to update an existing client upon editing
router.put('/:id', ClientController.updateClient);

// DELETE - a client
router.delete('/:id', ClientController.deleteClient);

module.exports = router;
