import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import MedicationForm from './components/MedicationForm';
import AdminDashboard from './components/Admindashboard';
import MedicationList from './components/MedicationList';
import EditMedication from './components/EditMedication';
import Acknoledgelog from './components/Acknoledgelog';

const App = () => {
  return (
    <Router>
      <div className="app">
        <h1>Medication Reminder App</h1>
        <nav>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/medication">Add Medication</Link> | <Link to="/logs">Logs</Link> | <Link to="/admindashboard">Dashboard</Link> 
        </nav>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/medication" element={<MedicationForm />} />
          <Route path="/admin" element={<MedicationList />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/logs" element={<Acknoledgelog />} />

          <Route path="/edit/:id" element={<EditMedication />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
