import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMedicationById, updateMedication } from '../utils/api';  // Make sure your API functions are correct

const EditMedication = () => {
  const { id } = useParams();  // Get the medication ID from the URL
  const navigate = useNavigate();

  const [medication, setMedication] = useState({
    medicineName: '',
    dosage: '',
    recurrence: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMedication = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMedicationById(id);  // Fetch medication details from the API
        setMedication(data);
      } catch (error) {
        setError('Error fetching medication details');
      } finally {
        setIsLoading(false);
      }
    };
    getMedication();
  }, [id]);

  // Handle changes to form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedication((prevMedication) => ({
      ...prevMedication,
      [name]: value,
    }));
  };

  // Handle form submission to update the medication
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateMedication(id, medication);  // Update medication via API
      navigate('/admin');  // Redirect back to the medication list
    } catch (error) {
      setError('Error updating medication');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2>Edit Medication</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Medicine Name</label>
            <input
              type="text"
              name="medicineName"
              value={medication.medicineName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Dosage</label>
            <input
              type="text"
              name="dosage"
              value={medication.dosage}
              onChange={handleChange}
              required
            />
          </div>
         
          <div>
            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditMedication;
