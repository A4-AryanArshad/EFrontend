import React, { useEffect, useState, useRef } from 'react';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { useApi } from './hooks/useApi';
import { API_BASE } from './config';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './DirectoryListing.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const DirectoryListing = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for animations
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const submitButtonRef = useRef(null);
  const errorRef = useRef(null);
  const successRef = useRef(null);
  
  const [form, setForm] = useState({
    company: '',
    email: '',
    phone: '',
    address: '',
    socialType: '',
    socialLink: '',
    industry: '',
    description: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { get, post } = useApi();

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      initializeAnimations();
    }
  }, [user, listings, isLoading]);

  const initializePage = async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchUser(), fetchListings()]);
    } catch (error) {
      console.error('Error initializing page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeAnimations = () => {
    // Title animation
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          ease: "power2.out"
        }
      );
    }

    // Form animation
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          ease: "power2.out",
          delay: 0.2
        }
      );
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      const data = await get(`${API_BASE}/api/me`, 'Loading user info...');
      if (data && data.package) {
        setUser({ 
          ...data, 
          package: data.package.toLowerCase().replace(' plan', '').trim() 
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  const fetchListings = async () => {
    try {
      const data = await get(`${API_BASE}/api/directory`, 'Loading directory listings...');
      setListings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
    }
  };

  const socialOptions = [
    { value: '', label: t('directory.select_platform') },
    { value: 'Facebook', label: t('directory.social_platforms.facebook') },
    { value: 'LinkedIn', label: t('directory.social_platforms.linkedin') },
    { value: 'Twitter', label: t('directory.social_platforms.twitter') },
    { value: 'Instagram', label: t('directory.social_platforms.instagram') },
  ];
  
  const industryOptions = [
    { value: '', label: t('directory.select_industry') },
    { value: 'Broker', label: t('directory.industries.broker') },
    { value: 'Exchange', label: t('directory.industries.exchange') },
    { value: 'Local Contractors', label: t('directory.industries.local_contractors') },
    { value: 'Project', label: t('directory.industries.project') },
    { value: 'Retail', label: t('directory.industries.retail') },
    { value: 'Wholesaler', label: t('directory.industries.wholesaler') },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm(prev => ({ ...prev, image: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!form.company.trim()) {
      setError(t('directory.errors.company_required'));
      return false;
    }
    if (!form.email.trim()) {
      setError(t('directory.errors.email_required'));
      return false;
    }
    if (!form.industry) {
      setError(t('directory.errors.industry_required'));
      return false;
    }
    if (form.socialType && !form.socialLink.trim()) {
      setError(t('directory.errors.social_link_required'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      setError(t('directory.login_required'));
      return;
    }

    if (user.package === 'free') {
      setError(t('directory.premium_required'));
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null && form[key] !== '') {
          formData.append(key, form[key]);
        }
      });
      formData.append('userPackage', user.package);

      const response = await fetch(`${API_BASE}/api/directory`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to submit listing');
      }

      setSuccess(t('directory.listing_submitted'));
      setForm({
        company: '',
        email: '',
        phone: '',
        address: '',
        socialType: '',
        socialLink: '',
        industry: '',
        description: '',
        image: null,
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
      
      await fetchListings(); // Refresh the listings
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || t('directory.errors.submission_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  const handleUpgradeRedirect = () => {
    window.location.href = '/pricing';
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="directory-container">
          <div className="directory-content">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>{t('common.loading')}</p>
            </div>
          </div>
        </div>
        <Footer2 />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="directory-container">
        <div className="directory-content">
          <h1 ref={titleRef} className="directory-title">
            {t('directory.title')}
          </h1>
          
          {error && (
            <div ref={errorRef} className="error-message">
              {error}
            </div>
          )}
          
          {success && (
            <div ref={successRef} className="success-message">
              {success}
            </div>
          )}

          {user && user.package !== 'free' ? (
            <div ref={formRef} className="directory-form-container">
              <h2 className="form-title">{t('directory.submit_company')}</h2>
              
              <form onSubmit={handleSubmit} className="directory-form">
                <div className="form-group">
                  <label className="form-label">
                    {t('directory.company_name')}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder={t('directory.placeholders.company')}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      {t('directory.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder={t('directory.placeholders.email')}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {t('directory.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder={t('directory.placeholders.phone')}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    {t('directory.address')}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={t('directory.placeholders.address')}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    {t('directory.website_social')}
                  </label>
                  <div className="social-links-container">
                    <select
                      name="socialType"
                      value={form.socialType}
                      onChange={handleChange}
                      className="form-select social-select"
                    >
                      {socialOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="url"
                      name="socialLink"
                      value={form.socialLink}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="form-input social-input"
                      disabled={!form.socialType}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    {t('directory.industry_category')}
                  </label>
                  <select
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {industryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    {t('directory.short_description')}
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    className="form-textarea"
                    placeholder={t('directory.placeholders.description')}
                  />
                </div>
                
                {user.package === 'premium' && (
                  <div className="form-group">
                    <label className="form-label">
                      {t('directory.logo_image')}
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="form-file-input"
                    />
                    <small className="file-help-text">
                      {t('directory.file_help_text')}
                    </small>
                  </div>
                )}
                
                <button
                  ref={submitButtonRef}
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('directory.submitting') : t('directory.submit_listing')}
                </button>
              </form>
            </div>
          ) : (
            <div className="login-prompt">
              <div className="prompt-content">
                <h3 className="prompt-title">
                  {!user ? t('directory.login_required_title') : t('directory.premium_required_title')}
                </h3>
                <p className="prompt-text">
                  {!user ? t('directory.login_required') : t('directory.premium_required')}
                </p>
                <div className="prompt-actions">
                  {!user ? (
                    <button 
                      onClick={handleLoginRedirect}
                      className="prompt-button login-button"
                    >
                      {t('directory.login_now')}
                    </button>
                  ) : (
                    <button 
                      onClick={handleUpgradeRedirect}
                      className="prompt-button upgrade-button"
                    >
                      {t('directory.upgrade_now')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default DirectoryListing; 