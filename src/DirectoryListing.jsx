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
  const [user, setUser] = useState(null); // { package: 'free'|'pro'|'premium', ... }
  const [listings, setListings] = useState([]);
  
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
    socialType: '', // new for dropdown
    socialLink: '', // new for input
    industry: '',
    description: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const { get, post } = useApi();

  useEffect(() => {
    fetchUser();
    fetchListings();
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    const checkAuthState = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn && user) {
        setUser(null);
      } else if (isLoggedIn && !user) {
        fetchUser();
      }
    };

    // Check immediately
    checkAuthState();

    // For mobile: check more frequently and on visibility change
    const interval = setInterval(checkAuthState, 1000);
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuthState);
    
    // Listen for custom login/logout events
    window.addEventListener('userLoggedIn', fetchUser);
    window.addEventListener('userLoggedOut', () => setUser(null));
    
    // Mobile-specific: check on page visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthState();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuthState);
      window.removeEventListener('userLoggedIn', fetchUser);
      window.removeEventListener('userLoggedOut', () => setUser(null));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  useEffect(() => {
    // Initialize animations
    initializeAnimations();
  }, [user, listings]);

  const initializeAnimations = () => {
    // Title animation
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Form animation
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, x: -50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Submit button animation
    if (submitButtonRef.current) {
      gsap.fromTo(submitButtonRef.current,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: submitButtonRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Error message animation
    if (errorRef.current) {
      gsap.fromTo(errorRef.current,
        { opacity: 0, scale: 0.8, y: -20 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.5, 
          ease: "back.out(1.7)" 
        }
      );
    }

    // Success message animation
    if (successRef.current) {
      gsap.fromTo(successRef.current,
        { opacity: 0, scale: 0.8, y: -20 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.5, 
          ease: "back.out(1.7)" 
        }
      );
    }
  };

  const fetchUser = async () => {
    // First check if user is logged in from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      setUser(null);
      return;
    }

    try {
      const data = await get(`${API_BASE}/api/me`, 'Loading user info...');
      setUser({ ...data, package: (data.package || '').toLowerCase().replace(' plan', '').trim() });
    } catch {
      setUser(null);
    }
  };

  const fetchListings = async () => {
    try {
      const data = await get(`${API_BASE}/api/directory`, 'Loading directory listings...');
      setListings(data);
    } catch {
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
      setForm(f => ({ ...f, image: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userPackage = localStorage.getItem('package');
    
    if (!isLoggedIn) {
      setError(t('directory.login_required'));
      return;
    }

    if (userPackage === 'free') {
      setError(t('directory.premium_required'));
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });
      // Add userPackage to the form data
      formData.append('userPackage', user.package);

      const response = await fetch(`${API_BASE}/api/directory`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit listing');
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
      fetchListings(); // Refresh the listings
    } catch (err) {
      setError(err.message || 'Failed to submit listing');
    }
  };

  const filteredListings = listings.filter(listing => 
    listing.company?.toUpperCase().startsWith(selectedLetter)
  );

  const getRowStyle = (userPackage) => {
    if (userPackage === 'free') return {};
    if (userPackage === 'pro') return { fontWeight: 'bold', color: '#4CAF50' };
    if (userPackage === 'premium') return { fontWeight: 'bold', color: '#2196F3' };
    return {};
  };

  return (
    <>
      <Header />
      <div className="directory-container">
        <div className="directory-content">
          <h1 ref={titleRef} className="directory-title">{t('directory.title')}</h1>
          
          {error && <div ref={errorRef} className="error-message">{error}</div>}
          {success && <div ref={successRef} className="success-message">{success}</div>}

          {(user && user.package !== 'free') || (localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('package') && localStorage.getItem('package') !== 'free') ? (
            <div ref={formRef} className="directory-form-container">
              <h2 className="form-title">{t('directory.submit_company')}</h2>
              <form onSubmit={handleSubmit} className="directory-form">
                <div className="form-group">
                  <label className="form-label">{t('directory.company_name')}</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('directory.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('directory.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{t('directory.address')}</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">{t('directory.website_social')}</label>
                  <div className="social-links-container">
                    <select
                      name="socialType"
                      value={form.socialType}
                      onChange={handleChange}
                      className="form-select social-select"
                      required
                    >
                      {socialOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <input
                      type="url"
                      name="socialLink"
                      value={form.socialLink}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="form-input social-input"
                      required={!!form.socialType}
                      disabled={!form.socialType}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{t('directory.industry_category')}</label>
                  <select
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {industryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{t('directory.short_description')}</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    className="form-textarea"
                  />
                </div>
                
                {user.package === 'premium' && (
                  <div className="form-group">
                    <label className="form-label">{t('directory.logo_image')}</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="form-file-input"
                    />
                  </div>
                )}
                
                <button
                  ref={submitButtonRef}
                  type="submit"
                  className="submit-button"
                >
                  {t('directory.submit_listing')}
                </button>
              </form>
            </div>
          ) : (
            <div className="login-prompt">
              <p className="prompt-text">
                {!user ? t('directory.login_required') : t('directory.premium_required')}
              </p>
            </div>
          )}

        
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default DirectoryListing; 