import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import "./Plan.css";
import Header from '../Home/Header';
import Footer2 from '../Home/Footer2';
import { useNavigate } from 'react-router-dom';
import { IoBulbOutline, IoRibbonOutline, IoAirplaneOutline } from 'react-icons/io5';
import { API_BASE } from '../config';

const Plan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [loading, setLoading] = useState(null); // Track which button is loading
  const [currentPackage, setCurrentPackage] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' }); // For success/error messages

  // Fetch user's current package
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${API_BASE}/api/me`, {
        credentials: 'include'
      })
      .then(res => res.json())
      .then(data => {
        const packageName = (data.package || '').toLowerCase().replace(' plan', '').trim();
        // If user doesn't have a pro or premium plan, set current package to 'free'
        if (packageName === 'pro' || packageName === 'premium') {
          setCurrentPackage(packageName);
        } else {
          setCurrentPackage('free');
        }
      })
      .catch(() => {
        setCurrentPackage('free');
      });
    } else {
      setCurrentPackage('');
    }
  }, [isLoggedIn]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleBuyNow = async (item) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Don't allow purchasing the same package
    if (currentPackage === item.id) {
      showMessage('You already have this package!', 'error');
      return;
    }

    // Handle free plan differently
    if (item.id === 'free') {
      // For free plan, just update the user's package directly
      try {
        const response = await fetch(`${API_BASE}/api/stripe-success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ packageName: item.name })
        });
        
        if (response.ok) {
          localStorage.setItem('package', 'free');
          showMessage('Free plan activated successfully!');
          navigate('/');
        } else {
          showMessage('Failed to activate free plan. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error activating free plan:', error);
        showMessage('Error activating free plan. Please try again.', 'error');
      }
      return;
    }

    // For paid plans, proceed with Stripe checkout
    setLoading(item.id);
    try {
      const response = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          cart: [{ 
            name: item.name, 
            price: item.price, 
            quantity: 1 
          }] 
        })
      });

      const data = await response.json();
      
      if (data.url) {
        localStorage.setItem('purchasedPackage', item.name);
        window.location.href = data.url;
      } else {
        showMessage('Failed to start checkout. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showMessage('Error connecting to payment gateway. Please try again.', 'error');
    } finally {
      setLoading(null);
    }
  };

  const getCardStyle = (planId) => {
    if (currentPackage === planId) {
      return {
        border: '3px solid #90be55',
        boxShadow: '0 0 20px rgba(144, 190, 85, 0.3)',
        position: 'relative'
      };
    }
    return {};
  };

  const getButtonStyle = (planId) => {
    if (currentPackage === planId) {
      return {
        background: '#90be55',
        color: 'white',
        cursor: 'not-allowed',
        opacity: 0.8
      };
    }
    return {};
  };

  const getButtonText = (planId) => {
    if (currentPackage === planId) {
      return 'Current Package';
    }
    if (planId === 'free') {
      return loading === 'free' ? 'Activating...' : 'Get Started';
    }
    return loading === planId ? 'Redirecting...' : t("plan.buy_now");
  };

  return (
    <>
      <div id="cover">
        <div id="uuq">
          <div id="hederArea">
            <Header />
          </div>

          <div id="innerPlan">
            <div id="innerheading">
              <h1>💼 Membership Packages</h1>
            </div>

            {/* Message Display */}
            {message.text && (
              <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: '500',
                backgroundColor: message.type === 'error' ? '#fee' : '#efe',
                color: message.type === 'error' ? '#c33' : '#363',
                border: `1px solid ${message.type === 'error' ? '#fcc' : '#cfc'}`
              }}>
                {message.text}
              </div>
            )}

            <div id="totalCards">
              {/* INDIVIDUAL PLAN */}
              <div id="Cards1" style={getCardStyle('free')}>
                {currentPackage === 'free' && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#90be55',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}>
                    CURRENT
                  </div>
                )}
                <div id="inCard">
                  <h3>🟢 1. Free Plan</h3>
                  <h1>Free</h1>
                  <p>→ Suitable for basic visibility</p>
                  <div id="Listing">
                    <p>✅ Listed in the Directory (as plain text)</p>
                    <p>❌ No access to Courses</p>
                    <p>❌ No discounts</p>
                    <p>❌ No Featured Listing (no image or highlight)</p>
                  </div>
                  <button 
                    onClick={() => handleBuyNow({id: 'free', name: 'Free Plan', price: 0})}
                    disabled={loading === 'free' || currentPackage === 'free'}
                    style={{ 
                      opacity: loading === 'free' ? 0.7 : 1,
                      ...getButtonStyle('free')
                    }}
                  >
                    {getButtonText('free')}
                  </button>
                </div>
              </div>

              {/* PROFESSIONAL PLAN */}
              <div id="Cards" style={getCardStyle('pro')}>
                {currentPackage === 'pro' && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#90be55',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}>
                    CURRENT
                  </div>
                )}
                <div id="inCard">
                  <h3>🔵 2. Pro Plan</h3>
                  <h1>C$29.99 / {t("plan.month")}</h1>
                  <p>→ Suitable for companies who want better visibility and course access</p>
                  <div id="Listing">
                    <p>✅ Listed in the Directory with:</p>
                    <p style={{ marginLeft: '20px' }}>• Bold Text</p>
                    <p style={{ marginLeft: '20px' }}>• Color</p>
                    <p style={{ marginLeft: '20px' }}>• Larger Font</p>
                    <p>✅ Access to all Instructor-led Courses</p>
                    <p>❌ No Course Discounts</p>
                    <p>❌ No Featured Listing on Homepage</p>
                  </div>
                  <button 
                    onClick={() => handleBuyNow({id: 'pro', name: 'Pro Plan', price: 29.99})}
                    disabled={loading === 'pro' || currentPackage === 'pro'}
                    style={{ 
                      opacity: loading === 'pro' ? 0.7 : 1,
                      ...getButtonStyle('pro')
                    }}
                  >
                    {getButtonText('pro')}
                  </button>
                </div>
              </div>

              {/* PREMIUM PLAN */}
              <div id="Cards3" style={getCardStyle('premium')}>
                {currentPackage === 'premium' && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#90be55',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}>
                    CURRENT
                  </div>
                )}
                <div id="inCard">
                  <h3>🟣 3. Premium Plan</h3>
                  <h1>C$49.99 / {t("plan.month")}</h1>
                  <p>→ Best for companies that want maximum exposure and course benefits</p>
                  <div id="Listing">
                    <p>✅ All Pro Plan features plus:</p>
                    <p>✅ Featured Listing on homepage (company image shown)</p>
                    <p>✅ Discounts on all Courses</p>
                    <p>✅ Access to all Instructor-led Courses</p>
                    <p>✅ Listed in the Directory with:</p>
                    <p style={{ marginLeft: '20px' }}>• Bold Text</p>
                    <p style={{ marginLeft: '20px' }}>• Color</p>
                    <p style={{ marginLeft: '20px' }}>• Larger Font</p>
                  </div>
                  <button 
                    onClick={() => handleBuyNow({id: 'premium', name: 'Premium Plan', price: 49.99})}
                    disabled={loading === 'premium' || currentPackage === 'premium'}
                    style={{ 
                      opacity: loading === 'premium' ? 0.7 : 1,
                      ...getButtonStyle('premium')
                    }}
                  >
                    {getButtonText('premium')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="Perks">
            <h1>{t("plan.membership_perks")}</h1>
            <p>{t("plan.perk1")}</p>
            <p>{t("plan.perk2")}</p>
          </div>

          <div id="iio">
            <div id="Blockchain">
              <h1>{t("plan.blockchain_title")}</h1>
              <p>{t("plan.blockchain_text")}</p>
            </div>
            <img id="imager" src="https://static.vecteezy.com/system/resources/previews/055/135/329/non_2x/3d-gold-coin-stacks-with-a-rising-arrow-representing-business-growth-investment-success-and-positive-financial-trends-free-png.png" />
          </div>

          <div id="yyy">
            <img id="imager2" src="https://www.tunley-environmental.com/hs-fs/hubfs/Website%20Sized%20Images/Graphics/Embodied%20Carbon%20Assessment-03.png?width=500&height=439&name=Embodied%20Carbon%20Assessment-03.png" />
            <div id="Blockchain2">
              <h1>{t("plan.investment_hub_title")}</h1>
              <p>{t("plan.investment_hub_text")}</p>
            </div>
          </div>

          <div id="Laster">
            <div id="Blockchain3">
              <h1>{t("plan.commitment_title")}</h1>
              <p>{t("plan.commitment_text")}</p>
            </div>
            <img id="lasterimg" src="https://static.vecteezy.com/system/resources/thumbnails/040/735/326/small/ai-generated-silhouette-two-hand-holding-soil-with-growing-sprout-black-color-only-png.png" />
          </div>
        </div>

        <Footer2 />
      </div>
    </>
  );
};

export default Plan;
