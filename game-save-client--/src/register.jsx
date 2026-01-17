import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Gamepad2, ArrowRight } from 'lucide-react';
import './login.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created! Please log in.");
        navigate('/login'); 
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon-login"><Gamepad2 size={40} /></div>
          </div>
          <h1>Join the Squad</h1>
          <p>Create your Game-o-Valda account</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input type="text" placeholder="Choose username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <button type="button" className="login-btn" disabled={isLoading} onClick={handleRegister}>
            {isLoading ? "Creating..." : "Sign Up"}
          </button>
        </div>

        <div className="login-footer">
          <p>Already have an account? <Link to="/login" className="signup-link">Log In</Link></p>
        </div>
      </div>
    </div>
  );
}