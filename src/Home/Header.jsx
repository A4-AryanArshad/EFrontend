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
    if (isLoggedIn && localStorage.getItem('isInstructor') !== 'true') {
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
            <option id="hos"  value="en">English</option>
            <option id="hos"  value="fr">Français</option>
            <option id="hos" value="es">Español</option>
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
              {/* Home Dropdown */}
              <li className="dropdown">
                <span
                  className="navbar-link"
                  onClick={() => { setNavOpen(false); window.location.href = '/'; }}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <span  id="hos" style={location.pathname === '/' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>
                    {t("navbar.home")}
                  </span>
                  <IoChevronForwardOutline style={{ marginLeft: 6 }} />
                </span>
                <ul className="dropdown-menu">
                  <li><span  id="hos"onClick={() => { setNavOpen(false); window.location.href = '/'; }} style={{ cursor: 'pointer' }}>Why choose us</span></li>
                  <li><span  id="hos"onClick={() => { setNavOpen(false); window.location.href = '/'; }} style={{ cursor: 'pointer' }}>What we do.</span></li>
                </ul>
              </li>
              {/* Service Dropdown */}
              <li className="dropdown">
                <span className="navbar-link" onClick={() => { setNavOpen(false); window.location.href = '/service'; }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <span  id="hos"style={location.pathname === '/service' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>
                    {t("navbar.service")}
                  </span>
                  <IoChevronForwardOutline style={{ marginLeft: 6 }} />
                </span>
                <ul className="dropdown-menu">
                  <li><span id="hos" onClick={() => { setNavOpen(false); window.location.href = '/service'; }} style={{ cursor: 'pointer' }}>Directory Listing</span></li>
                  <li><span  id="hos"onClick={() => { setNavOpen(false); window.location.href = '/service'; }} style={{ cursor: 'pointer' }}>Corporate Training Courses</span></li>
                  <li><span  id="hos"onClick={() => { setNavOpen(false); window.location.href = '/service'; }} style={{ cursor: 'pointer' }}>Carbon Footprint Assessment & Reporting</span></li>
                  <li><span  id="hos"style={{ cursor: 'pointer', fontWeight: 'bold', color: '#fff', textShadow: '0 0 2px #90be55' }}>Edu Ficelle</span></li>
                  <li><span  id="hos"onClick={() => { setNavOpen(false); window.location.href = '/service'; }} style={{ cursor: 'pointer' }}>Satellite-Verified Offset Project Explorer <span style={{ color: 'green' }}>Soon</span></span></li>
                </ul>
              </li>
              {/* Pricing Dropdown */}
              <li className="dropdown">
                <span className="navbar-link" onClick={() => { setNavOpen(false); window.location.href = '/pricing'; }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <span  id="hos"style={location.pathname === '/pricing' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>
                    {t("navbar.pricing")}
                  </span>
                  <IoChevronForwardOutline style={{ marginLeft: 6 }} />
                </span>
                <ul className="dropdown-menu">
                  <li><span  id="hos"onClick={() => { setNavOpen(false); window.location.href = '/pricing'; }} style={{ cursor: 'pointer' }}>Plans</span></li>
                  <li><span  id="hos"onClick={() => { setNavOpen(false); window.location.href = '/pricing'; }} style={{ cursor: 'pointer' }}>Courses</span></li>
                </ul>
              </li>
              {/* News Dropdown */}
              <li className="dropdown">
                <span className="navbar-link" onClick={() => { setNavOpen(false); window.location.href = '/news'; }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <span  id="hos"style={location.pathname === '/news' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>
                    {t("navbar.news")}
                  </span>
                  <IoChevronForwardOutline style={{ marginLeft: 6 }} />
                </span>
                <ul className="dropdown-menu">
                  <li><span  id="hos"onClick={() => { setNavOpen(false); window.location.href = '/news'; }} style={{ cursor: 'pointer' }}>News</span></li>
                  <li><span  id="hos"onClick={() => { setNavOpen(false); window.location.href = '/news'; }} style={{ cursor: 'pointer' }}>Blog</span></li>
                </ul>
              </li>


              {/* Resources Dropdown (was Trade) */}
              <li className="dropdown">
                <span className="navbar-link" onClick={() => { setNavOpen(false); window.location.href = '/trade'; }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <span  id="hos" style={location.pathname === '/trade' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>
                    Resources
                  </span>
                  <IoChevronForwardOutline style={{ marginLeft: 6 }} />
                </span>
                <ul className="dropdown-menu">
                  <li><span  id="hos" onClick={() => { setNavOpen(false); window.location.href = '/trade'; }} style={{ cursor: 'pointer' }}>DecarbXchange</span></li>
                  <li><span  id="hos" onClick={() => { setNavOpen(false); window.location.href = '/trade'; }} style={{ cursor: 'pointer' }}>Carbon Offsetting Guides</span></li>
                  <li><span  id="hos"onClick={() => { setNavOpen(false); window.location.href = '/trade'; }} style={{ cursor: 'pointer' }}>Tools & Resources</span></li>
                  <li><span  id="hos" onClick={() => { setNavOpen(false); window.location.href = '/trade'; }} style={{ cursor: 'pointer' }}>Our Partners</span></li>
                </ul>
              </li>

              {/* Show 'BCourses' for Pro/Premium users, never show 'Courses' */}
              {isLoggedIn && (userPackage === 'pro' || userPackage === 'premium') && (
                <li>
                  <Link to="/buy-courses" className="navbar-link" onClick={() => setNavOpen(false)}>
                    <span  id="hos" style={location.pathname === '/buy-courses' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>BCourses</span>
                    <IoChevronForwardOutline />
                  </Link>
                </li>
              )}
          
              {isLoggedIn && localStorage.getItem('isInstructor') !== 'true' && (
                <li>
                  <Link to="/directory" className="navbar-link" onClick={() => setNavOpen(false)}>
                    <span  id="hos" style={location.pathname === '/directory' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>Directory</span>
                    <IoChevronForwardOutline />
                  </Link>
                </li>
              )}
              {(isLoggedIn && localStorage.getItem('isInstructor') === 'true') && (
                <li>
                  <Link to="/slots" className="navbar-link" onClick={() => setNavOpen(false)}>
                    <span  id="hos" style={location.pathname === '/slots' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>Slots</span>
                    <IoChevronForwardOutline />
                  </Link>
                </li>
              )}
              {/* Login Dropdown */}
              {!isLoggedIn && (
                <li className="dropdown">
                  <span className="navbar-link" onClick={() => { setNavOpen(false); window.location.href = '/login'; }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <span id="hos"  style={location.pathname === '/login' ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>
                      {t("navbar.login")}
                    </span>
                    <IoChevronForwardOutline style={{ marginLeft: 6 }} />
                  </span>
                  <ul className="dropdown-menu">
                    <li><span  id="hos" onClick={() => { setNavOpen(false); window.location.href = '/login'; }} style={{ cursor: 'pointer' }}>Login</span></li>
                    <li><span  id="hos" onClick={() => { setNavOpen(false); window.location.href = '/contact'; }} style={{ cursor: 'pointer' }}>Contact us</span></li>
                  </ul>
                </li>
              )}
            </ul>
          </nav>

          <div className="header-action" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {!isLoggedIn && (
            <Link  id="hos"to="/signup">
              <button className="btn btn-primary">
                <span>{t("join_now")}</span>
                <IoHeartOutline />
              </button>
            </Link>
            )}
            {isLoggedIn && (
              <button  id="hos"className="btn btn-primary" style={{ background: '#e74c3c', border: 'none' }} onClick={handleLogout}>
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
