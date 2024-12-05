const Medication = require('../models/medication');
const jwt = require('jsonwebtoken'); // Import JWT for decoding the token


// Create Medication with userId
const createMedication = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header
    if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

    // Verify the token and decode it to get the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify using the correct secret
    const userId = decoded.userId;  // Use 'userId' from the token
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing in token' });
    }

    // Get medication details from the request body
    const { medicineName, dosage, scheduleTime } = req.body;

    // Create new medication with the userId
    const newMedication = new Medication({
      medicineName,
      dosage,
      scheduleTime,
      userId  // Attach the userId to the medication
    });

    // Save the medication to the database
    await newMedication.save();

    // Return the newly created medication
    res.status(201).json(newMedication);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating medication', error: error.message });
  }
};

// Get all Medications for the logged-in user
const getMedications = async (req, res) => {
  try {
    const userId = req.userId;  // userId should be set by your auth middleware

    // Find medications for the logged-in user
    const medications = await Medication.find({ userId: userId });

    // If no medications found, return a message
    if (medications.length === 0) {
      return res.status(404).json({ message: 'No medications found for this user' });
    }

    // Return the medications
    res.status(200).json(medications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching medications', error });
  }
};
// Get all Medications for the logged-in user
const getMedicationById = async (req, res) => {
  try {
    // Step 1: Find the medication by ID and ensure it belongs to the logged-in user
    const medication = await Medication.findOne({ _id: req.params.id, userId: req.userId });

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Step 2: Return the medication
    res.status(200).json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medication', error });
  }
};

// Update Medication by ID for the logged-in user
const updateMedication = async (req, res) => {
  try {
    // Step 1: Find the medication and update it, ensuring it belongs to the logged-in user
    const updatedMedication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }  // Return the updated document
    );

    if (!updatedMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Step 2: Return the updated medication
    res.status(200).json(updatedMedication);
  } catch (error) {
    res.status(400).json({ message: 'Error updating medication', error });
  }
};

// Delete Medication by ID for the logged-in user
const deleteMedication = async (req, res) => {
  try {
    // Step 1: Find and delete the medication that belongs to the logged-in user
    const deletedMedication = await Medication.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!deletedMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Step 2: Return success message
    res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medication', error });
  }
};
exports.acknowledgeMedication = async (req, res) => {
  const { medicationId } = req.body;
  const userId = req.user.id; // assuming the user is authenticated and you have userId available

  try {
    // Find the medication
    const medication = await Medication.findById(medicationId);

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Check if it's already acknowledged
    const existingAck = await AcknowledgmentLog.findOne({
      medicationId: medication._id,
      userId,
      status: 'acknowledged',
    });

    if (existingAck) {
      return res.status(400).json({ message: 'Medication already acknowledged' });
    }

    // Log the acknowledgment in the AcknowledgmentLog (or directly update the medication status)
    const newAck = new AcknowledgmentLog({
      medicationId: medication._id,
      userId,
      status: 'acknowledged',
      timestamp: new Date(),
    });

    await newAck.save();

    // Optionally, you can also directly update the medication document if needed
    // medication.isAcknowledged = true;
    // await medication.save();

    return res.status(200).json({ message: 'Medication acknowledged successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to acknowledge medication' });
  }
};

module.exports = {
  createMedication,
  getMedications,
  getMedicationById,
  updateMedication,
  deleteMedication
};