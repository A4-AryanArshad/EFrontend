import React, { useEffect } from "react";
import {
  IoLeafOutline,
  IoEarthOutline,
  IoFlowerOutline,
  IoBoatOutline,
  IoArrowForward,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";

import subtitleImage from "./assets/images/subtitle-img-green.png";
import serviceBg from "./assets/images/service-map.png";
import "./assets/css/style.css";

const Service = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const services = [
    {
      icon: <IoLeafOutline />,
      title: t("serviceData.0.title"),
      text: t("serviceData.0.text"),
    },
    {
      icon: <IoEarthOutline />,
      title: t("serviceData.1.title"),
      text: t("serviceData.1.text"),
    },
    {
      icon: <IoFlowerOutline />,
      title: t("serviceData.2.title"),
      text: t("serviceData.2.text"),
    },
    {
      icon: <IoBoatOutline />,
      title: t("serviceData.3.title"),
      text: t("serviceData.3.text"),
    },
  ];

  return (
    <section
      className="section service"
      id="service"
      style={{ backgroundImage: `url(${serviceBg})` }}
    >
      <div className="container">
        <p className="section-subtitle">
          <img src={subtitleImage} width="32" height="7" alt="Wavy line" />
          <span>{t("service.subtitle")}</span>
        </p>

        <h2 className="h2 section-title">
          {t("service.heading.part1")} <strong>{t("service.heading.part2")}</strong>
        </h2>

        <ul className="service-list">
          {services.map((service, index) => (
            <li key={index}>
              <div className="service-card">
                <div className="card-icon">{service.icon}</div>
                <h3 className="h3 card-title">{service.title}</h3>
                <p className="card-text">{service.text}</p>
                <a href="#" className="btn-link">
                  <span>{t("service.readMore")}</span>
                  <IoArrowForward aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Service;
