const Medication = require('../models/medication');
const AcknowledgmentLog = require('../models/acknoledge');

// Controller to handle acknowledgment of a medication
exports.acknowledgeMedication = async (req, res) => {
  try {
    // Find the medication by ID
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Update the medication's acknowledgment status
    medication.acknowledged = true;  // Assuming there's an 'acknowledged' field in the medication model
    await medication.save();

    // Log the acknowledgment in the AcknowledgmentLog collection
    const log = new AcknowledgmentLog({
      userId: req.user.id,  // Assuming user ID is attached to the request (e.g., from JWT auth)
      medicationId: medication._id,
      status: 'acknowledged',
    });

    await log.save();  // Save the acknowledgment log

    return res.status(200).json({ message: 'Medication acknowledged successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.checkAcknowledgmentStatus = async (req, res) => {
  try {
    const medicationId = req.params.id;  // Get the medication ID from the URL
    const userId = req.user.id;  // Get the authenticated user's ID from the request

    // Find the acknowledgment log for the given medication and user
    const acknowledgment = await AcknowledgmentLog.findOne({
      medicationId: medicationId,
      userId: userId,
      status: 'acknowledged',  // Only check for acknowledged status
    });

    // If no acknowledgment log found, return false, else return true
    if (acknowledgment) {
      return res.status(200).json({ acknowledged: true });
    } else {
      return res.status(200).json({ acknowledged: false });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.getUserAcknowledgmentLogs = async (req, res) => {
  // Ensure that only admins can access this route

  const userId = req.user.id; // Get the userId from the authenticated request
console.log(userId)
  try {
    const logs = await AcknowledgmentLog.find({ userId })
      .populate('medicationId', 'medicineName dosage')  // Populate medication details
      .populate('userId', 'name')  // Populate user details
      .sort({ timestamp: -1 });  // Sort logs by most recent

    if (!logs.length) {
      return res.status(404).json({ message: 'No acknowledgment logs found for this user.' });
    }

    return res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch user acknowledgment logs.' });
  }
};

exports.getAcknowledgmentLogs = async (req, res) => {
  try {
    // Extract userId from the query parameters
    const { userId } = req.query;

    // Ensure query object is empty
    let query = {};

    // If userId is provided, filter logs by the userId
    if (userId) {
      query.userId = userId;  // Filter logs for the specific userId
    }

    // Fetch acknowledgment logs based on the query parameters
   const logs = await AcknowledgmentLog.find(query)
  .populate('userId', 'name')  // Populate userId with 'name' field
  .populate('medicationId', 'medicineName dosage')  // Populate medication details
  .sort({ timestamp: -1 });

console.log(logs); // Sort logs by most recent

    if (!logs.length) {
      return res.status(404).json({ message: 'No acknowledgment logs found.' });
    }

    // Return the logs
    return res.status(200).json(logs);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch acknowledgment logs.', error: error.message });
  }
};
