import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMedications, deleteMedication, acknowledgeMedication } from '../utils/api';
import '../styles/MedicationList.css';

const MedicationList = () => {
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const name = localStorage.getItem('name');
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
    navigate('/login');
  };

  useEffect(() => {
    const getMedications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchMedications();
        setMedications(data);
      } catch (error) {
        console.error('Error fetching medications:', error);
        setError('Failed to fetch medications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    getMedications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setIsLoading(true);
      try {
        await deleteMedication(id);
        setMedications((prevMedications) => prevMedications.filter((med) => med._id !== id));
      } catch (error) {
        console.error('Error deleting medication:', error);
        alert('Error deleting medication. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleAcknowledge = async (id) => {
    try {
      const response = await acknowledgeMedication(id);  // Call the backend to log the acknowledgment
      // Update the status on the frontend after acknowledgment
      setMedications((prevMedications) =>
        prevMedications.map((med) =>
          med._id === id ? { ...med, isAcknowledged: true } : med
        )
      );
      alert('Medication acknowledged successfully');
    } catch (error) {
      console.error('Error acknowledging medication:', error);
      alert('Error acknowledging medication. Please try again.');
    }
  };

  return (
    <div>
      {name && <p>Welcome, {name}!</p>}

      {name && (
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      )}

      <h2>Your Medications</h2>

      {error && <p className="error">{error}</p>}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Status</th> {/* New column to show acknowledgment status */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((medication) => (
              <tr key={medication._id}>
                <td>{medication.medicineName}</td>
                <td>{medication.dosage}</td>
                <td>
                  {medication.isAcknowledged ? (
                    <span>Acknowledged</span>
                  ) : (
                    <span>Not Acknowledged</span>
                  )}
                </td>
                <td>
                  <button className="delete" onClick={() => handleDelete(medication._id)}>
                    Delete
                  </button>
                  <button className="edit" onClick={() => handleEdit(medication._id)}>
                    Edit
                  </button>
                  <button
                    className="acknowledge"
                    onClick={() => handleAcknowledge(medication._id)}
                    disabled={medication.isAcknowledged}
                  >
                    {medication.isAcknowledged ? 'Acknowledged' : 'Acknowledge'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MedicationList;
