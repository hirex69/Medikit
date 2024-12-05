const express = require('express');
const authenticate = require('../middleware/authMiddleware'); // Import the authentication middleware
const { acknowledgeMedication, checkAcknowledgmentStatus, getUserAcknowledgmentLogs } = require('../controller/acknoledgecontroller');
const { getAcknowledgmentLogs } = require('../controller/acknoledgecontroller'); // Import the controller
const router = express.Router();

// Use authenticate middleware to ensure the user is logged in
router.patch('/medications/:id/acknowledge', authenticate, acknowledgeMedication);
router.get('/medications/:id/acknowledged', authenticate, checkAcknowledgmentStatus);
// router.get('/user/logs', authenticate, getUserAcknowledgmentLogs);
router.get('/logs', getAcknowledgmentLogs);  // Query by patientId or medicationId
module.exports = router;
