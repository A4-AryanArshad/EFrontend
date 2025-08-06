import React, { useEffect, useState, useRef } from 'react';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { useApi } from './hooks/useApi';
import { API_BASE } from './config';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupIPhoneDetection, isIPhoneSafari, getAuthHeaders } from './utils/iphoneFix';
import './DirectoryListing.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const DirectoryListing = () => {
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
    // Setup iPhone Safari detection and fixes
    setupIPhoneDetection();
    
    if (isIPhoneSafari()) {
      console.log('iPhone Safari detected - using fallback authentication');
    }
    
    fetchUser();
    fetchListings();
  }, []);

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
    // For iPhone Safari, skip user authentication and allow public access
    if (isIPhoneSafari()) {
      console.log('iPhone Safari detected - allowing public access to directory');
      setUser({ package: 'public' }); // Set a special package for iPhone users
      return;
    }
    
    try {
      const data = await get(`${API_BASE}/api/me`, 'Loading user info...');
      setUser({ ...data, package: (data.package || '').toLowerCase().replace(' plan', '').trim() });
    } catch (err) {
      console.log('User fetch error:', err);
      setUser(null);
    }
  };

  const fetchListings = async () => {
    try {
      let data;
      
      // For iPhone Safari, try the special endpoint first
      if (isIPhoneSafari()) {
        try {
          const response = await fetch(`${API_BASE}/api/directory/iphone-access`, {
            credentials: 'include',
            headers: getAuthHeaders(),
          });
          
          if (response.ok) {
            const result = await response.json();
            data = result.listings;
          } else {
            throw new Error('iPhone endpoint failed');
          }
        } catch (iphoneError) {
          console.log('iPhone endpoint failed, trying regular endpoint:', iphoneError);
          data = await get(`${API_BASE}/api/directory`, 'Loading directory listings...');
        }
      } else {
        data = await get(`${API_BASE}/api/directory`, 'Loading directory listings...');
      }
      
      setListings(data);
    } catch (err) {
      console.log('Listings fetch error:', err);
      setListings([]);
    }
  };

  const socialOptions = [
    { value: '', label: 'Select Platform' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'LinkedIn', label: 'Linkedin' },
    { value: 'Twitter', label: 'X(Twitter)' },
    { value: 'Instagram', label: 'Instagram' },
  ];
  const industryOptions = [
    { value: '', label: 'Select Industry' },
    { value: 'Broker', label: 'Broker' },
    { value: 'Exchange', label: 'Exchange' },
    { value: 'Local Contractors', label: 'Local Contractors' },
    { value: 'Project', label: 'Project' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Wholesaler', label: 'Wholesaler' },
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

    // For iPhone Safari, show a message to use desktop for submissions
    if (isIPhoneSafari()) {
      setError('Please use a desktop computer to submit listings. Directory viewing is available on mobile.');
      return;
    }

    if (!user) {
      setError('Please log in to submit a listing');
      return;
    }

    if (user.package === 'free') {
      setError('Premium membership required to submit listings');
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

      setSuccess('Listing submitted successfully!');
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
      <div style={{ margin:'120px',background: '#fff', minHeight: '100vh', padding: '180px 0 60px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h1 ref={titleRef} style={{ textAlign: 'center', marginBottom: 40, color: '#333' }}>Directory Listing</h1>
          
          {isIPhoneSafari() && (
            <div style={{ 
              background: '#e3f2fd', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              border: '1px solid #2196f3',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#1976d2', fontSize: '14px' }}>
                📱 <strong>Mobile View:</strong> Directory listings are viewable on mobile. 
                To submit your company listing, please use a desktop computer.
              </p>
            </div>
          )}
          
          {error && <div ref={errorRef} style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>{error}</div>}
          {success && <div ref={successRef} style={{ color: 'green', textAlign: 'center', marginBottom: 20 }}>{success}</div>}

          {user && user.package !== 'free' && !isIPhoneSafari() ? (
            <div ref={formRef} style={{ background: '#f9f9f9', padding: 30, borderRadius: 10, marginBottom: 40 }}>
              <h2 style={{ marginBottom: 20, color: '#333' }}>Submit Your Company</h2>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 15 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Website/Social Links</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <select
                      name="socialType"
                      value={form.socialType}
                      onChange={handleChange}
                      style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
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
                      style={{ flex: 1, padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                      required={!!form.socialType}
                      disabled={!form.socialType}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Industry/Category</label>
                  <select
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                    required
                  >
                    {industryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Short Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5, resize: 'vertical' }}
                  />
                </div>
                
                {user.package === 'premium' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Logo/Image</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                    />
                  </div>
                )}
                
                <button
                  ref={submitButtonRef}
                  type="submit"
                  style={{
                    background: '#90be55',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 5,
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}
                >
                  Submit Listing
                </button>
              </form>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ color: '#666', fontSize: 18 }}>
                {isIPhoneSafari() 
                  ? 'Directory viewing available on mobile. Please use desktop to submit listings.' 
                  : (!user ? 'Please log in to submit a listing.' : 'Premium membership required to submit listings.')
                }
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