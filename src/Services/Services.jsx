import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../Home/Header';
import Footer2 from '../Home/Footer2';
import './Services.css';
import { useApi } from '../hooks/useApi';
import { API_BASE } from '../config';

const Services = () => {
  const { t, i18n } = useTranslation();
  const [featuredImages, setFeaturedImages] = useState([]);
  const [directoryListings, setDirectoryListings] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [user, setUser] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const { get } = useApi();

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
    fetchFeaturedImages();
    fetchDirectoryListings();
    fetchUser();
  }, [i18n]);

  const fetchUser = async () => {
    try {
      const data = await get(`${API_BASE}/api/me`, 'Loading user info...');
      setUser({ ...data, package: (data.package || '').toLowerCase().replace(' plan', '').trim() });
    } catch {
      setUser(null);
    }
  };

  const fetchFeaturedImages = async () => {
    try {
      const data = await get(`${API_BASE}/api/featured-listings`, 'Loading featured listings...');
      setFeaturedImages(data);
    } catch (err) {
      setFeaturedImages([]);
    }
  };

  const fetchDirectoryListings = async () => {
    try {
      const data = await get(`${API_BASE}/api/directory`, 'Loading directory listings...');
      setDirectoryListings(data);
    } catch (err) {
      setDirectoryListings([]);
    }
  };

  const handleImageUpload = async (listingId, file) => {
    setUploadingId(listingId);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      // PATCH endpoint to update directory listing with image
      const res = await fetch(`${API_BASE}/api/directory/${listingId}/image`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to upload image');
      await fetchDirectoryListings();
    } catch (err) {
      setUploadError('Image upload failed.');
    } finally {
      setUploadingId(null);
    }
  };

  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const filteredListings = directoryListings.filter(l => (l.company || '').toUpperCase().startsWith(selectedLetter));

  return (
    <>
      <div id="cover">
        <div id="totalr">
          <div id="Hederarea">
            <Header />
          </div>

          <div id="directory-listing">
            <div id="Listingg">
              <h1>{t("services.directoryListing.title")}</h1>
              {/* Directory A-Z Filter Row */}
              <div id="parenta" style={{ fontSize: 32, margin: '24px 0', textAlign: 'center', whiteSpace: 'nowrap', overflowX: 'auto', width: '100%' }}>
                {alphabet.map((letter, idx) => (
                  <span id="iparent"key={letter}>
                    <span
                      onClick={() => setSelectedLetter(letter)}
                      style={{
                        cursor: 'pointer',
                        fontWeight: selectedLetter === letter ? 700 : 400,
                        color: selectedLetter === letter ? '#90be55' : '#222',
                        textDecoration: selectedLetter === letter ? 'underline' : 'none',
                        fontSize: selectedLetter === letter ? 40 : 32,
                        transition: 'all 0.2s',
                      }}
                    >
                      {letter}
                    </span>
                    {idx < alphabet.length - 1 && <span>, </span>}
                  </span>
                ))}
              </div>
              {/* Directory Table */}
              <div  id="ttable">
              {filteredListings.length > 0 ? (
                <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 24, boxShadow: '0 6px 32px rgba(0,0,0,0.10)', padding: 0, marginTop: 32, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 16 }}>
                    <thead>
                      <tr style={{ background: '#f7f7f7', fontWeight: 800 }}>
                        <th style={{ padding: '16px 0', border: 'none', textAlign: 'center', letterSpacing: 1 }}>COMPANY</th>
                        <th style={{ padding: '16px 0', border: 'none', textAlign: 'center', letterSpacing: 1 }}>SOCIAL LINK</th>
                        <th style={{ padding: '16px 0', border: 'none', textAlign: 'center', letterSpacing: 1 }}>EMAIL</th>
                        <th style={{ padding: '16px 0', border: 'none', textAlign: 'center', letterSpacing: 1 }}>PHONE NUMBER</th>
                        <th style={{ padding: '16px 0', border: 'none', textAlign: 'center', letterSpacing: 1 }}>CATEGORY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredListings.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: 24 }}>No listings for {selectedLetter}.</td>
                        </tr>
                      )}
                      {filteredListings.map((l, i) => {
                        // Determine package: use listing.package, but if current user matches and has upgraded, use user.package
                        let effectivePackage = l.package;
                        if (user && user.email === l.email && user.package && user.package !== l.package) {
                          effectivePackage = user.package;
                        }
                        let style = { fontWeight: 400, color: '#222', textAlign: 'center', background: i % 2 === 0 ? '#fff' : '#fafbfc' };
                        if (effectivePackage === 'pro') style = { ...style, fontWeight: 700, color: '#27ae60' };
                        if (effectivePackage === 'premium') style = { ...style, fontWeight: 700, color: '#ff6b57' };
                        return (
                          <tr key={i}>
                            <td style={{ ...style, padding: '14px 0', border: 'none' }}>{l.company}</td>
                            <td style={{ ...style, padding: '14px 0', border: 'none' }}>
                              {l.socialType && l.socialLink ? (
                                <>
                                  <a href={l.socialLink} target="_blank" rel="noopener noreferrer">
                                    <button id="tb" style={{ padding: '4px 14px', borderRadius: 8, background: 'transparent', color: '#27ae60', border: '2px solid #27ae60', fontWeight: 700, fontSize: 16, cursor: 'pointer', textTransform: 'capitalize' }}>{l.socialType}</button>
                                  </a>
                                </>
                              ) : ''}
                            </td>
                            <td style={{ ...style, padding: '14px 0', border: 'none' }}>{l.email}</td>
                            <td style={{ ...style, padding: '14px 0', border: 'none' }}>{l.phone}</td>
                            <td style={{ ...style, padding: '14px 0', border: 'none' }}>{l.industry}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : directoryListings.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#aaa', fontSize: 18, marginTop: 40 }}>No companies in the directory yet.</div>
              ) : null}
            </div>
            </div>
          </div>
          <div id="featured">
            <h1>{t("services.featuredListing")}</h1>
          </div>

          <div id="bannerr1" style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {featuredImages.length === 0 && (
              <div style={{ color: '#888', fontSize: 18 }}>No featured listings yet.</div>
            )}
            {featuredImages.map(img => (
              <div key={img._id} style={{ border: '1px solid #222', borderRadius: 28, padding: 0, background: '#fff', minWidth: 320, minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={img.imageUrl} alt="Featured" style={{ width: 320, height: 140, objectFit: 'contain', borderRadius: 24 }} />
            </div>
            ))}
          </div>

          <div id="des">
            <div id="innerdes">
              <p>{t("services.description")}</p>
            </div>
          </div>

          <div id="ufcourse">
            <div id="fcourse">
              <button>{t("services.courseButton")}</button>
            </div>
          </div>

          <div id="utotalscard">
            <div id="totalscard">
              {[1, 2, 3, 4].map((_, i) => (
                <div id="scard" key={i}>
                  <img src={`./s${i+1}.png`} />
                  <h1>{t(`services.cards.${i}.title`)}</h1>
                  <p>{t(`services.cards.${i}.desc`)}</p>
                  <div id="innerh1s">
                    <h1>{t("services.professor")}</h1>
                    <p>Marie Curie</p>
                  </div>
                  <div id="innerh1ss">
                    <h1>{t("services.commencing")}</h1>
                    <p>01/01/2024</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="ubottomtexter">
            <div id="bottomtexter">
              <p>{t("services.trainingSummary")}</p>
            </div>
          </div>

          <div id="bottomone">
            <div id="bcard1">
              <h1>{t("services.course1.title")}</h1>
              <p>{t("services.course1.line1")}</p>
              <p>{t("services.course1.line2")}</p>
              <p>{t("services.course1.line3")}</p>
              <p>{t("services.course1.line4")}</p>
              <h1>⭐ 4.3 ★★★★★ (990 students)</h1>
              <p>{t("services.createdBy")}</p>
            </div>
            <div id="bcard11">
              <h1>{t("services.course2.title")}</h1>
              <p>{t("services.course2.desc")}</p>
              <h1>⭐ 4.4 ★★★★★ (4,576 students)</h1>
              <p>{t("services.createdBy")}</p>
            </div>
          </div>
        </div>
        <Footer2 />
      </div>
    </>
  );
};

export default Services;
