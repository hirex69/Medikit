// src/components/MedicationForm.js

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/MedicationForm.css'; // Ensure CSS is imported
import { useNavigate } from 'react-router-dom';
import TimePicker from 'react-time-picker'; // Import the TimePicker component

const MedicationForm = () => {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('10:00'); // Default time
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!medicineName || !dosage || !scheduleTime) {
      setError('All fields are required');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to add medication');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/medications', 
        {
          medicineName,
          dosage,
          scheduleTime: [{ time: scheduleTime, recurrence: 'daily' }] // Save schedule time
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          }
        }
      );

      console.log('Medication added successfully:', response.data);
      navigate('/admin'); 
    } catch (error) {
      console.error('Error adding medication:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Error adding medication');
    }
  };

  return (
    <div className="medication-form">
      <h2>Add Medication</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Medicine Name"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
        </div>
        <div className="schedule-time-container">
          <label>Schedule Time</label>
          <TimePicker
            value={scheduleTime}
            onChange={setScheduleTime} // Update the time
            disableClock={true} // Disable the clock
            format="hh:mm a" // Use AM/PM format
          />
        </div>
        <button type="submit">Add Medication</button>
      </form>
    </div>
  );
};

export default MedicationForm;


