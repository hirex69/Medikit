const User = require('../models/user');
const Medication = require('../models/medication');  // Assuming you have a Medication model

// Controller function to get all users and their medications
exports.getAllUsersWithMedications = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find();

    // For each user, fetch their medications
    const usersWithMedications = await Promise.all(users.map(async (user) => {
      const medications = await Medication.find({ userId: user._id }); // Assuming each medication has a `userId` field
      return { user, medications };
    }));

    return res.status(200).json({ usersWithMedications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching users and medications' });
  }
};
