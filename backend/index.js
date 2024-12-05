const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const medicationRoutes = require('./routes/medicationRoute');
const acknowledgmentRoutes = require('./routes/acknoledgeRoute');
const adminRoutes = require('./routes/superAdmin');  // Import the admin routes


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Add the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());  // Parses JSON request body

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes); // Medication routes
app.use('/api', acknowledgmentRoutes);  // Use the acknowledgment routes
app.use('/api/admin', adminRoutes); // Admin routes


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
