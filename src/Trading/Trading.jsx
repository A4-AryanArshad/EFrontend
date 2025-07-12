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
        <div id="logp2a">
          <img src="./Logo2.webp" alt="Logo" />
          <button>{t("trading.coming_soon")}</button>
        </div>

        <div id="upperlog">
          <div id="logp2a2">
            <h1>{t("trading.marketplace_heading")}</h1>
            <img src="https://carboncredits.com/wp-content/uploads/2023/02/carbon-credit-futures-e1677257727994.jpg" alt="Marketplace" />
          </div>
        </div>

        <div id="middleer">
          <div id="logo2a3">
            <h1>{t("trading.revolution_title")}</h1>
            <div id="innerl1">
              <div id="ary">
                <h1>{t("trading.carbon_trading_title")}</h1>
                <p>{t("trading.carbon_trading_text1")}</p>
                <p>{t("trading.carbon_trading_text2")}</p>
              </div>
              <img id="eweq" src="https://images.unsplash.com/photo-1580064461598-505b080a8242?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FyYm9uJTIwZW1pc3Npb25zfGVufDB8fDB8fHww" alt="Carbon Emissions" />
            </div>
          </div>

          <div id="thirdl">
            <div id="f1">
              <h1>{t("trading.leading_platform")}</h1>
              <h1>{t("trading.p2p_platform")}</h1>
            </div>
            <div id="f2">
              <h1>{t("trading.env_market")}</h1>
              <h1>{t("trading.at_fingertips")}</h1>
            </div>
          </div>

          <div id="marketC">
            <div id="forthl">
              {cards.map((card, idx) => (
                <div id="ddu" key={idx}>
                  <div id="dd" onClick={() => window.open(card.link, "_blank")}>
                    <button>*</button>
                    <h1>{card.title || 'Untitled'}</h1>
                    <p>{card.description || 'No description available'}</p>
                  </div>
                </div>
              ))}
            </div>

            <div id="market">
              <h1>{t("trading.market_data")}</h1>
              <p>{t("trading.market_description")}</p>
            </div>
          </div>
        </div>

        <div id="lasterr">
          <div id="covv">
            <div id="logp2a2">
              <h2>{t("trading.fractional_investment")}</h2>
              <img src="https://pbservices.ge/wp-content/uploads/2023/04/life-hacks-1024x576.jpg.webp" alt="Investment Hub" />
            </div>
          </div>

          <div id="texterareaq">
            <h1>{t("trading.democratizing_title")}</h1>
            <p>{t("trading.democratizing_text")}</p>
          </div>
        </div>

        <Footer2 />
      </div>
    </>
  );
};

export default Trading;
