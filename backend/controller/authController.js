const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register user
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate inputs
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password_hash: hashedPassword,
      role
    });

    // Save user to database
    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering user' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Issue a token containing userId and role
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name }, // Include role in the payload
      process.env.JWT_SECRET,  // Ensure this is defined in your .env file
      { expiresIn: '1h' }
    );

    // Send the token and role back to the client
    res.status(200).json({ token, role: user.role, name: user.name }); // Include role in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};