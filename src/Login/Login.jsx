import React, { useState } from 'react';
import Header from '../Home/Header';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import Footer2 from '../Home/Footer2';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    setIsLoading(true);

    // Use direct fetch for login to avoid iPhone Safari interference
    const makeLoginRequest = async (url, data) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      return response.json();
    };

    // First, check if instructor
    try {
      const instructorRes = await makeLoginRequest('https://e-back-bice.vercel.app/api/instructor-login', formData);
      if (instructorRes && instructorRes.isInstructor) {
        setSuccess('Instructor login successful!');
        localStorage.setItem('isInstructor', 'true');
        localStorage.setItem('isLoggedIn', 'true');

        localStorage.setItem('instructorEmail', formData.email); // Save instructor email
        localStorage.setItem('userEmail', formData.email); // Save user email for booking
        localStorage.setItem('userId', instructorRes.instructorId); // Store instructorId as userId for slot page
        
        // Store fallback token for iPhone Safari
        if (instructorRes.token) {
          localStorage.setItem('fallbackToken', instructorRes.token);
        }

        localStorage.setItem('instructorEmail', formData.email);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userId', instructorRes.instructorId);

        setTimeout(() => navigate('/slots'), 1500);
        return;
      }
    } catch (err) {
      // Not an instructor, continue to user/admin login
    }

    try {
      const data = await makeLoginRequest('https://e-back-bice.vercel.app/api/login', formData);

      localStorage.setItem('userId', data.userId); // Store userId for booking

      localStorage.setItem('userId', data.userId);

      const normalizedPackage = (data.package || "free").toLowerCase().replace(" plan", "").trim();
      localStorage.setItem("package", normalizedPackage);
      
      // Store fallback token for iPhone Safari
      if (data.token) {
        localStorage.setItem('fallbackToken', data.token);
      }

      if (formData.email === "admin1234@gmail.com" && formData.password === "admin1234") {
        setSuccess("Admin login successful!");
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem('userEmail', formData.email);
        setTimeout(() => navigate('/Articles'), 1500);
      } else {
        localStorage.setItem("isAdmin", "false");
        localStorage.setItem("isLoggedIn", "true");
        setSuccess('Login successful!');
        localStorage.setItem('userEmail', formData.email);
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error logging in.');
    } finally {
      setIsLoading(false);
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
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : t("login.submit")}
            </button>
          </form>
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default Login;
