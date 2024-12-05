// routes/medicationRoutes.js

const express = require('express');
const { createMedication, getMedications, getMedicationById, updateMedication, deleteMedication } = require('../controller/medicationController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to authenticate users
const router = express.Router();

// POST route to create a medication
router.post('/', authMiddleware, createMedication); // The POST route for adding medications

// GET route to get all medications
router.get('/', authMiddleware, getMedications);

// GET route to get medication by id
router.get('/:id', authMiddleware, getMedicationById);

// PUT route to update a medication
router.put('/:id', authMiddleware, updateMedication);

// DELETE route to delete a medication
router.delete('/:id', authMiddleware, deleteMedication);

module.exports = router;
