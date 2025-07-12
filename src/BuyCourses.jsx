import React, { useEffect, useState } from 'react';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { useApi } from './hooks/useApi';
import { API_BASE } from './config';

const COURSE = {
  title: "Net Zero Carbon Strategy for Business",
  description: "A comprehensive course on decarbonisation, carbon accounting, carbon reduction, and sustainability for businesses. Taught by industry experts. Includes video lectures, downloadable resources, and a certificate.",
  price: 10,
  image: require('./Home/Logo.png'),
  id: 'netzero-carbon-course',
};

const BuyCourses = () => {
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(8);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);
  const [error, setError] = useState('');
  const [stripeLoading, setStripeLoading] = useState(false);
  const userPackage = (localStorage.getItem('package') || '').toLowerCase();
  const isEligible = userPackage === 'pro' || userPackage === 'premium';
  const hasCourse = localStorage.getItem('hasCourse') === 'true';
  const { get, post } = useApi();

  useEffect(() => {
    // Optionally, fetch from backend if you want to check real purchase status
  }, []);

  const checkAvailability = async () => {
    setChecking(true);
    setError('');
    setTimeout(() => {
      setAvailable(true);
      setChecking(false);
    }, 700);
  };

  const handleCheckout = async () => {
    setStripeLoading(true);
    setError('');
    let price = COURSE.price * people;
    if (userPackage === 'premium') price = price * 0.8;
    try {
      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cart: [{ name: COURSE.title, price, quantity: 1 }]
        })
      });
      const data = await res.json();
      if (data.url) {
        localStorage.setItem('purchasedPackage', `course:${COURSE.title}`);
        localStorage.setItem('hasCourse', 'true');
        window.location.href = data.url;
      } else {
        setError('Failed to start checkout.');
      }
    } catch (err) {
      setError('Checkout error.');
    } finally {
      setStripeLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{ margin:'200px',background: '#fff', minHeight: '100vh', padding: '120px 0 60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 400, background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden', margin: '32px 0', padding: 0 }}>
          <div style={{ height: 180, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
            <img src={COURSE.image} alt="Course" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <span style={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: '#ffb400',
              color: '#fff',
              borderRadius: 8,
              padding: '4px 16px',
              fontWeight: 600,
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'inline-block',
            }}>Featured</span>
          </div>
          <div style={{ padding: 28 }}>
            <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>{COURSE.title}</h2>
            <div style={{ color: '#222', fontSize: 16, marginBottom: 12 }}>{COURSE.description}</div>
            <div style={{ color: '#27ae60', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
              Price: ${COURSE.price} per person {userPackage === 'premium' && <span>(20% off for Premium!)</span>}
            </div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 18 }}>Minimum 8 people per booking.</div>
            {!isEligible && (
              <div style={{ color: '#e74c3c', fontWeight: 600, fontSize: 18, margin: '18px 0' }}>
                You must have a Pro or Premium membership to buy this course.<br />
                <a href="/pricing" style={{ color: '#ff6b57', textDecoration: 'underline' }}>See Membership Plans</a>
              </div>
            )}
            {hasCourse && (
              <div style={{ color: '#27ae60', fontWeight: 600, fontSize: 18, margin: '18px 0' }}>
                You have already purchased this course.<br />
                <a href="/courses" style={{ color: '#ff6b57', textDecoration: 'underline' }}>Go to Courses</a>
              </div>
            )}
            {isEligible && !hasCourse && (
              <>
                <ol style={{ marginBottom: 16, color: '#888', fontSize: 15, paddingLeft: 18 }}>
                  <li>Select number of people (min 8)</li>
                  <li>Pick a date</li>
                  <li>Check availability</li>
                  <li>Proceed to checkout and payment</li>
                </ol>
                <label style={{ display: 'block', marginBottom: 8 }}>Number of people (min 8):</label>
                <input type="number" min={8} value={people} onChange={e => setPeople(Math.max(8, parseInt(e.target.value)||8))} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                <label style={{ display: 'block', marginBottom: 8 }}>Pick a date:</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                <button onClick={checkAvailability} disabled={checking || !date} style={{ width: '100%', background: '#90be55', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, marginBottom: 12 }}>
                  {checking ? 'Checking...' : 'Check Availability'}
                </button>
                {available && (
                  <>
                    <div style={{ marginBottom: 12, color: '#27ae60' }}>Available!</div>
                    <button onClick={handleCheckout} disabled={stripeLoading} style={{ width: '100%', background: '#ff6b57', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600 }}>
                      {stripeLoading ? 'Redirecting...' : `Checkout ($${userPackage === 'premium' ? (COURSE.price*people*0.8).toFixed(2) : (COURSE.price*people).toFixed(2)})`}
                    </button>
                  </>
                )}
                {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default BuyCourses; 