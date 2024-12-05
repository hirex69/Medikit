const express = require('express');
const { getAllUsersWithMedications } = require('../controller/superAdminController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// GET route for admin to get all users and their medications
router.get('/users', authMiddleware, getAllUsersWithMedications);


module.exports = router;
