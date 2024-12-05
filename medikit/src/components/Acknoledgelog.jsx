import React, { useEffect, useState } from 'react';
import { fetchAcknowledgmentLogs } from '../utils/api';  // Function to fetch acknowledgment logs from the backend

const Acknoledgelog = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAcknowledgmentLogs();  // Fetch logs from API
        setLogs(data);
      } catch (error) {
        console.error('Error fetching acknowledgment logs:', error);
        setError('Failed to fetch acknowledgment logs.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Acknowledgment Logs</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>  // Display error message if there is an error
      ) : (
        <table>
          <thead>
            <tr>
              <th>Medication</th>
              <th>User</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              // Check if all required fields are present
              if (
                !log.medicationId ||
                !log.userId ||
                !log.status ||
                !log.timestamp
              ) {
                return null;  // Skip rendering this row if any required field is missing
              }

              return (
                <tr key={log._id}>
                  <td>{log.medicationId.medicineName}</td>  {/* Medication name */}
                  <td>{log.userId.name}</td>  {/* User name */}
                  <td>{log.status}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>  {/* Timestamp */}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Acknoledgelog;
