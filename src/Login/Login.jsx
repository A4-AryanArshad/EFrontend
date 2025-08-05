import React, { useState } from 'react';
import Header from '../Home/Header';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import Footer2 from '../Home/Footer2';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks/useApi';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { post } = useApi();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // First, check if instructor
    try {
      const instructorRes = await post('https://e-back-bice.vercel.app/api/instructor-login', formData, 'Logging in...');
      if (instructorRes && instructorRes.isInstructor) {
        setSuccess('Instructor login successful!');
        localStorage.setItem('isInstructor', 'true');
        localStorage.setItem('isLoggedIn', 'true');

        localStorage.setItem('instructorEmail', formData.email); // Save instructor email
        localStorage.setItem('userEmail', formData.email); // Save user email for booking
        localStorage.setItem('userId', instructorRes.instructorId); // Store instructorId as userId for slot page

        localStorage.setItem('instructorEmail', formData.email);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userId', instructorRes.instructorId);

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('userLoggedIn'));

        setTimeout(() => navigate('/slots'), 1500);
        return;
      }
    } catch (err) {
      // Not an instructor, continue to user/admin login
    }

    try {
      const data = await post('https://e-back-bice.vercel.app/api/login', formData, 'Logging in...');

      localStorage.setItem('userId', data.userId); // Store userId for booking

      localStorage.setItem('userId', data.userId);

      const normalizedPackage = (data.package || "free").toLowerCase().replace(" plan", "").trim();
      localStorage.setItem("package", normalizedPackage);

      if (formData.email === "admin1234@gmail.com" && formData.password === "admin1234") {
        setSuccess("Admin login successful!");
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem('userEmail', formData.email);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        
        setTimeout(() => navigate('/Articles'), 1500);
      } else {
        localStorage.setItem("isAdmin", "false");
        localStorage.setItem("isLoggedIn", "true");
        setSuccess('Login successful!');
        localStorage.setItem('userEmail', formData.email);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error logging in.');
    }
  };

  return (
    <>
      <div id="upperheader">
        <Header />
        <div id="uuy">
          <form id="form" onSubmit={handleLogin}>
            <h2>{t("login.title")}</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{success}</div>}
            <div id="ineerf">
              <span>{t("login.email")} :</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div id="ineerf">
              <span>{t("login.password")} :</span>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit">{t("login.submit")}</button>
          </form>
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default Login;
