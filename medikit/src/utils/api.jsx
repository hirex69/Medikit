import axios from 'axios';

const API_URL = 'https://medikit.onrender.com/api/auth';  // Update with your backend URL

// Create an Axios instance for handling requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to headers of subsequent requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to handle login request
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    console.log('Login response:', response.data); // Log the full response

    // Store the token in localStorage after successful login
    const { token, name, role  } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('name', name);  // Save the username
    localStorage.setItem('role', role);  // Save the user's role


console.log(name)
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'An error occurred' };
  }
};

// Function to handle register request
export const registerUser = async (name, email, password, role) => {
  try {
    const response = await api.post('/register', { name, email, password, role });
    
    // If the response contains a token, store it
    const { token } = response.data;
    localStorage.setItem('authToken', token);

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'An error occurred' };
  }
};

// Function to handle logout
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('name');  // Optional: clear username if stored
  window.location.href = '/login';  // Redirect to login
};

// Fetch medications with the stored token
const fetchMedications = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No authentication token found');
      return [];  // Return an empty array if there's no token
    }

    const response = await axios.get('https://medikit.onrender.com/api/medications', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Assuming the response data is an array
    return response.data || [];  // Ensure it returns an empty array if data is undefined
  } catch (error) {
    console.error('Error fetching medications:', error);
    return [];  // Return an empty array in case of error
  }
};

// api.js// api.js
// Example of a simple saveAcknowledgment API function

export const saveAcknowledgment = async (acknowledgmentData) => {
  try {
    const response = await axios.post('https://medikit.onrender.com/api', acknowledgmentData);
    return response;
  } catch (error) {
    console.error('Error in API request:', error);
    throw error;  // Re-throw the error to be handled in the calling function
  }
};

// Get Medication by ID
export const fetchMedicationById = async (id) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('https://medikit.onrender.com/api/medications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching medication by ID:', error);
    throw error;
  }
};

// Update Medication
export const updateMedication = async (id, medicationData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.put(`https://medikit.onrender.com/api/medications/${id}`, medicationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating medication:', error);
    throw error;
  }
};

// Delete Medication
// Delete Medication
export const deleteMedication = async (id) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.delete(`https://medikit.onrender.com/api/medications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
};
export const acknowledgeMedication = async (id) => {
  const token = localStorage.getItem('authToken');  // Get auth token from localStorage

  const response = await fetch(  `https://medikit.onrender.com/api/medications/${id}/acknowledge`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ medicationId: id }),  // Send the medication ID
  });

  if (!response.ok) {
    throw new Error('Failed to acknowledge medication');
  }

  return await response.json();
};

// Fetch acknowledgment logs
export const fetchAcknowledgmentLogs = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`https://medikit.onrender.com/api/logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
const checkAcknowledgment = async (medicationId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/medications/${medicationId}/acknowledged`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include token from localStorage
        },
      }
    );
    console.log('Acknowledgment status:', response.data.acknowledged ? 'Acknowledged' : 'Not Acknowledged');
  } catch (error) {
    console.error('Error checking acknowledgment status:', error.response?.data || error.message);
  }
};
// Exporting the fetchMedications function
export { fetchMedications };
