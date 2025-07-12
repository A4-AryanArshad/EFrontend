import React, { useEffect, useState } from 'react';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { useApi } from './hooks/useApi';
import { API_BASE } from './config';

const DirectoryListing = () => {
  const [user, setUser] = useState(null); // { package: 'free'|'pro'|'premium', ... }
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({
    company: '',
    email: '',
    phone: '',
    address: '',
    website: '',
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

  const fetchUser = async () => {
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
        website: '',
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
          <h1 style={{ textAlign: 'center', marginBottom: 40, color: '#333' }}>Directory Listing</h1>
          
          {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>{error}</div>}
          {success && <div style={{ color: 'green', textAlign: 'center', marginBottom: 20 }}>{success}</div>}

          {user && user.package !== 'free' ? (
            <div style={{ background: '#f9f9f9', padding: 30, borderRadius: 10, marginBottom: 40 }}>
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
                  <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Industry/Category</label>
                  <input
                    type="text"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                  />
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
                {!user ? 'Please log in to submit a listing.' : 'Premium membership required to submit listings.'}
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