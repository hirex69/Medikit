import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation (in case admin is not logged in)
import '../styles/Admindashboard.css';
import { fetchAcknowledgmentLogs } from '../utils/api'; // Assuming the function is exported from utils

const AdminDashboard = () => {
  const [usersMedications, setUsersMedications] = useState([]);
  const [acknowledgmentLogs, setAcknowledgmentLogs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Used for navigation if user is not authorized

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Remove the token from localStorage
    navigate('/login');  // Redirect the user to the login page
  };

  // Fetch medications and acknowledgment logs when the component mounts
  useEffect(() => {
    const fetchUsersAndMedications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');  // Redirect to login if no token found
          return;
        }

        // Check if the user is an admin
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
          navigate('/login');  // Redirect to home if the user is not an admin
          return;
        }

        // Fetch users and their medications
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter out the users who have the role "admin"
        const filteredUsers = response.data.usersWithMedications.filter(userData => userData.user.role !== 'admin');
        setUsersMedications(filteredUsers); // Set the filtered data to state

        // Fetch acknowledgment logs for all users
        const logs = await fetchAcknowledgmentLogs();
        setAcknowledgmentLogs(logs); // Save acknowledgment logs
      } catch (err) {
        setError('Failed to fetch users and medications');
        console.error(err);
      }
    };

    fetchUsersAndMedications();
  }, [navigate]);

  // Helper function to check if a medication has been acknowledged
  const isAcknowledged = (medicationId) => {
    const log = acknowledgmentLogs.find(log => log.medicationId._id === medicationId);
    return log ? log.status === 'Acknowledged' : false; // Return true if the status is 'Acknowledged'
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <button onClick={handleLogout} className="logout-btn">Logout</button>

      {/* Display the list of users and their medications in a table */}
      {usersMedications.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Medication Name</th>
              <th>Dosage</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {usersMedications.map((userData) => (
              userData.medications.length > 0 ? (
                userData.medications.map((medication) => (
                  <tr key={medication._id}>
                    <td>{userData.user.name}</td>
                    <td>{medication.medicineName}</td>
                    <td>{medication.dosage}</td>
                    <td>{medication.scheduleTime[0]?.time || 'No time set'}</td>
                  </tr>
                ))
              ) : (
                <tr key={userData.user._id}>
                  <td>{userData.user.name}</td>
                  <td colSpan="4">No medications found for this user.</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
