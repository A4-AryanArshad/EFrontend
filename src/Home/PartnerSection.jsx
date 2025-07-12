import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoHeartOutline } from "react-icons/io5";
import "./assets/css/style.css";

const PartnerSection = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <section className="section cta">
      <div className="container">
        <div className="cta-content">
          <h2 className="h2 section-title">{t("cta.title")}</h2>
          <button className="btn btn-outline">
            <span>{t("cta.button")}</span>
            <IoHeartOutline aria-hidden="true" />
          </button>
        </div>

        <figure className="cta-banner">
          <img
            src="https://25025637.fs1.hubspotusercontent-eu1.net/hubfs/25025637/RSE.png"
            width="520"
            height="228"
            loading="lazy"
            alt="Fox"
            className="img-cover"
          />
        </figure>
      </div>
    </section>
  );
};

export default PartnerSection;
