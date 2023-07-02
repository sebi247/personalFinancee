import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Register from './Components/Register';
import Login from './Components/Login';
import Profile from './Components/Profile';
import Income from './Components/Income';
import Expense from './Components/Expense';
import Investment from './Components/Investment';
import Dashboard from './Components/Dashboard';
import './App.css';
import { AuthProvider } from './Components/AuthContext';

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/income" element={<Income />} />
                        <Route path="/expense" element={<Expense />} />
                        <Route path="/investment" element={<Investment />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/" element={<Login />} />
                        <Route path="*" element={<Dashboard />} />
                    </Routes>
            </Router>
        </AuthProvider>
  );
}
