import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import "./Footer2.css";
import { AiOutlineTwitter, AiFillYoutube, AiFillFacebook, AiFillInstagram } from "react-icons/ai";
import { API_BASE } from '../config';

const Footer2 = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setMessage('Subscribed successfully!');
        setEmail('');
      } else {
        const data = await res.json();
        setMessage(data.error || 'Subscription failed.');
      }
    } catch (err) {
      setMessage('Subscription failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div id="Footer2">
        <div id="sii">
          <AiOutlineTwitter id="si" />
          <AiFillYoutube id="si" />
          <AiFillFacebook id="si" />
          <AiFillInstagram id="si" />
        </div>

        <h1>{t("footer.subscribe_heading")}</h1>
        {message && (
          <div style={{ color: message.includes('success') ? 'green' : 'red', margin: '8px 0', textAlign: 'center', fontWeight: 500 }}>
            {message}
          </div>
        )}
        <div id="f2b" className="subscribe-container">
          <form onSubmit={handleSubscribe} className="subscribe-form">
            <input
              type="email"
              placeholder={t("footer.subscribe_placeholder")}
              required
              className="subscribe-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" className="subscribe-button" disabled={submitting}>
              {submitting ? 'Subscribing...' : t("footer.subscribe_button")}
            </button>
          </form>
        </div>

        <h1>{t("footer.portal_name")}</h1>
        <h2>{t("footer.copyright")}</h2>
        <p>{t("footer.nav_links")}</p>

        <section className="insta-post">
          <ul className="insta-post-list">
            {["https://media.istockphoto.com/id/2159656867/photo/young-plant-springing-up-out-of-the-moss-soil.jpg?s=612x612&w=0&k=20&c=Ty01uSR2K79x-sMScG904DPqmzUjb2zKGYdCyF3V1I0=",
              "https://media.istockphoto.com/id/1915263063/photo/illustration-for-environmental-concept-green-business-or-investment-an-endless-circular.jpg?s=612x612&w=0&k=20&c=mIrv13yy0NYTSwKYY5iLeBfBYX0lX1e8LtNGJcyftiw=",
              "https://media.istockphoto.com/id/2157221045/photo/aerial-view-of-dark-green-forest-road-and-white-electric-car-natural-landscape-and-elevated.jpg?s=612x612&w=0&k=20&c=5MouHs8slXfdmVXrWybpJOLWL8lpjo7rkX05OLnUBic=",
              "https://media.istockphoto.com/id/1474783424/photo/reduce-co2-emissions-to-limit-climate-change-and-global-warming.jpg?s=612x612&w=0&k=20&c=IRML6v3r5Mzz08M9AtQgPKOoYsqiiRjr5Il0PzlbFH4=",
              "https://media.istockphoto.com/id/1496309989/photo/reduce-co2-emission-concept-co2-symbol-on-green-grass-in-the-forest-lower-co2-emissions-to.jpg?s=612x612&w=0&k=20&c=QRF8QzYdtsA2Sypya094rMBRvXU8kKqD-Ecxoe6d5A4="
            ].map((i) => (
              <li key={i} className="insta-post-item">
                <a href="#" className="insta-post-link">
                  <img src={i} width="320" height="300" loading="lazy" alt="Instagram Image" className="img-cover" />
                  <ion-icon name="logo-instagram"></ion-icon>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

export default Footer2;
