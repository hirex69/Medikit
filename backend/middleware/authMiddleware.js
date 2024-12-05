// const jwt = require('jsonwebtoken');
// const User = require('../models/user');  // Assuming you have a User model

// // Middleware to authenticate both admin and user
// const authenticate = async (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ message: 'Authentication required' });
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach userId from decoded token to the request object
//     req.userId = decoded.userId;

//     // Fetch the user from the database using the userId
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     // Attach the user object to the request
//     req.user = user;

//     console.log("Authenticated user:", req.user); // For debugging purposes

//     next();  // Proceed to the next middleware or route handler
//   } catch (error) {
//     console.error(error);
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// module.exports = authenticate;
const jwt = require('jsonwebtoken');
const User = require('../models/user');  // Assuming you have a User model

// This middleware will check the user role and allow access based on that
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;  // Assuming the JWT payload contains userId

    // Fetch the user from the database
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;  // Attach the user to the request object

    // If the user is not an admin or patient, return a forbidden error
    if (user.role !== 'admin' && user.role !== 'patient') {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }

    // Check if the user is admin (for admin-only resources)
    if (user.role === 'admin') {
      req.isAdmin = true;
    }

    next();  // Move to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;