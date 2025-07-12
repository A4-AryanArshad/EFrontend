import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from '../Home/Header';
import Footer2 from '../Home/Footer2';
import { useApi } from '../hooks/useApi';

const Signup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { post } = useApi();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const data = await post('https://e-back-bice.vercel.app/api/signup', formData, 'Signing up...');
      setSuccess('Signup successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Signup failed!');
    }
  };

  return (
    <>
      <div id="upperheader">
        <Header />

        <div id="uuy">
          <form id="form" onSubmit={handleSubmit}>
            <h2>{t("signup.title")}</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{success}</div>}
            <div id="ineerf">
              <span>{t("signup.first_name")} :</span>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>

            <div id="ineerf">
              <span>{t("signup.last_name")} :</span>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <div id="ineerf">
              <span>{t("signup.email")} :</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div id="ineerf">
              <span>{t("signup.password")} :</span>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>

            <button type="submit">{t("signup.submit")}</button>
          </form>
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default Signup;
