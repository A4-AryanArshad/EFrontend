import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../Home/Header';
import Footer2 from '../Home/Footer2';
import './Trading.css';
import { useApi } from '../hooks/useApi';
import { API_BASE_URL } from '../config';

const Trading = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const { get } = useApi();

  const fetchCards = async () => {
    try {
      // Get the selected language from localStorage
      const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
      const data = await get(`${API_BASE_URL}/card/cards?lang=${selectedLanguage}`, 'Loading trading cards...');
      setCards(data);
    } catch (err) {
      console.error("Error fetching cards:", err);
    }
  };

  useEffect(() => {
    fetchCards();
    // Listen for language changes
    const handleLanguageChange = () => {
      fetchCards();
    };
    window.addEventListener('storage', handleLanguageChange);
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('storage', handleLanguageChange);
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <>
      <div id="trade">
        <Header />
      </div>
      <div id='logo2b'>
        {/* DecarbXchange Logo and Coming Soon Button - Keep unchanged */}
        <div id="logp2a">
          <img src="./Logo2.webp" alt="Logo" />
          <button>{t("trading.coming_soon")}</button>
        </div>
        
        {/* Carbon Offsetting Guides Section */}
        <div id="carbon-guides-section">
          <h1>Carbon Offsetting Guides</h1>
          <div id="guides-container">
            {cards.map((card, idx) => (
              <div className="guide-card" key={idx} onClick={() => window.open(card.link, "_blank")}>
                <div className="guide-card-content">
                  <h3>{card.title || 'Untitled'}</h3>
                  <p>{card.description || 'No description available'}</p>
                  <button className="guide-button">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CO2 Emissions Calculator and Democratizing Section */}
        <div id="calculator-democratizing-container">
          <div id="calculator-section">
            <h1>Calculate your CO2 Emissions</h1>
            <div id="calculator-container">
              <iframe 
                style={{ height: '730px', width: '100%' }} 
                src="https://plugin.sustainabletravel.com/?api_key=STIKEY_687aad94750ee556806795&primary_color=%23008370&secondary_color=%23f7961f&light_primary_color=%2366e9d6&sort_order=Flight%2CHotel%2CCar%2CBoat"
                title="CO2 Emissions Calculator"
              />
            </div>
          </div>

          {/* Democratizing Green Investment Section */}
          <div id="democratizing-section">
            <div className="democratizing-content">
              <h1>Democratizing Green Investment: A New Paradigm</h1>
              <p>The urgency of climate action has spurred a global revolution of investment strategies, pushing sustainable finance from a niche to a central priority. Within this transformation, fractional ownership emerges as an innovation that is enabling broader participation beyond institutional giants and the wealthy.</p>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div id="partners-section">
          <h1>Partners</h1>
          <div id="partners-logos">
            <div className="partner-logo">
              <img src="./pi1.webp" alt="Fragile Impact" />
            </div>
            <div className="partner-logo">
              <img src="./pi2.webp" alt="PH-PLUS 500ml" />
            </div>
            <div className="partner-logo">
              <img src="./pi3.webp" alt="PH-PLUS Kids" />
            </div>
           
          </div>
        </div>

      
        <Footer2 />
      </div>
    </>
  );
};

export default Trading;
