import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./assets/css/style.css";
import {
  IoMenuOutline,
  IoCloseOutline,
  IoChevronForwardOutline,
  IoHeartOutline
} from "react-icons/io5";
import { API_BASE } from '../config';

const COURSE_TITLE = "Net Zero Carbon Strategy for Business";

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const location = useLocation();
  const [hasCourse, setHasCourse] = useState(false);
  const [userPackage, setUserPackage] = useState("");

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    window.addEventListener('storage', checkLogin);
    // Listen for login changes in the same tab
    const interval = setInterval(checkLogin, 500);
    return () => {
      window.removeEventListener('storage', checkLogin);
      clearInterval(interval);
    };
  }, []);

  // Fetch user info from backend for navbar logic
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${API_BASE}/api/me`, {
        credentials: 'include'
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.courses) && data.courses.includes(COURSE_TITLE)) {
          setHasCourse(true);
        }
        setUserPackage((data.package || '').toLowerCase().replace(' plan', '').trim());
      })
      .catch(() => {
        setHasCourse(false);
        setUserPackage('');
      });
    } else {
      setHasCourse(false);
      setUserPackage('');
    }
  }, [isLoggedIn]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem("selectedLanguage", newLang);
    window.dispatchEvent(new Event('languageChanged'));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('package');
    localStorage.removeItem('hasCourse');
    localStorage.removeItem('purchasedPackage');
    setIsLoggedIn(false);
    setHasCourse(false);
    setUserPackage('');
    window.location.href = '/';
  };

  return (
    <>
      <header id="hhw" className="header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1>
            <a href="#" className="logo"><img id="logoo" src="Logo.png"  /></a>
          </h1>

          {/* Language Dropdown */}
          <select
            name="language"
            className="lang-switch"
            onChange={handleLanguageChange}
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>

          {/* Open Menu Button */}
          <button
            className="nav-open-btn"
            aria-label="Open Menu"
            onClick={() => setNavOpen(true)}
          >
            <IoMenuOutline />
          </button>

          {/* Navigation Menu */}
          <nav className={`navbar ${navOpen ? "active" : ""}`}>
            <button
              className="nav-close-btn"
              aria-label="Close Menu"
              onClick={() => setNavOpen(false)}
            >
              <IoCloseOutline />
            </button>

            <a href="#" className="logo">{t("navbar.logo")}</a>

            <ul className="navbar-list">
              <li>
                <Link to="/" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span style={location.pathname === '/' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>{t("navbar.home")}</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
              <li>
                <Link to="/service" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span style={location.pathname === '/service' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>{t("navbar.service")}</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
              <li>
                <Link to="/trade" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span style={location.pathname === '/trade' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>{t("navbar.trade")}</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span style={location.pathname === '/pricing' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>{t("navbar.pricing")}</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
              {/* Show 'Courses' if user has purchased, otherwise 'Buy Courses' for Pro/Premium users */}
              {hasCourse ? (
                <li>
                  <Link to="/courses" className="navbar-link" onClick={() => setNavOpen(false)}>
                    <span style={location.pathname === '/courses' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>Courses</span>
                    <IoChevronForwardOutline />
                  </Link>
                </li>
              ) : (
                isLoggedIn && (userPackage === 'pro' || userPackage === 'premium') && (
                  <li>
                    <Link to="/buy-courses" className="navbar-link" onClick={() => setNavOpen(false)}>
                      <span style={location.pathname === '/buy-courses' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>BCourses</span>
                      <IoChevronForwardOutline />
                    </Link>
                  </li>
                )
              )}
              <li>
                <Link to="/news" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span style={location.pathname === '/news' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>{t("navbar.news")}</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span style={location.pathname === '/contact' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>Contact</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
              {isLoggedIn && (
                <li>
                  <Link to="/directory" className="navbar-link" onClick={() => setNavOpen(false)}>
                    <span style={location.pathname === '/directory' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>Directory</span>
                    <IoChevronForwardOutline />
                  </Link>
                </li>
              )}
              {!isLoggedIn && (
                <li>
                  <Link to="/login" className="navbar-link" onClick={() => setNavOpen(false)}>
                    <span style={location.pathname === '/login' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>{t("navbar.login")}</span>
                    <IoChevronForwardOutline />
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="header-action" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {!isLoggedIn && (
            <Link to="/signup">
              <button className="btn btn-primary">
                <span>{t("join_now")}</span>
                <IoHeartOutline />
              </button>
            </Link>
            )}
            {isLoggedIn && (
              <button className="btn btn-primary" style={{ background: '#e74c3c', border: 'none' }} onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
