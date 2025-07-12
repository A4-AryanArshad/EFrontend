import React, { useEffect } from "react";
import {
  IoShieldCheckmarkOutline,
  IoWaterOutline,
  IoLeafOutline,
  IoSnowOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import "./assets/css/style.css";

const Features = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const featuresData = [
    {
      icon: <IoShieldCheckmarkOutline />,
      title: t("features.safe_shelter.title"),
      text: t("features.safe_shelter.text"),
    },
    {
      icon: <IoWaterOutline />,
      title: t("features.safe_water.title"),
      text: t("features.safe_water.text"),
    },
    {
      icon: <IoLeafOutline />,
      title: t("features.ecology_save.title"),
      text: t("features.ecology_save.text"),
    },
    {
      icon: <IoSnowOutline />,
      title: t("features.environment.title"),
      text: t("features.environment.text"),
    },
  ];

  return (
    <section className="section features">
      <div className="container">
        <ul className="features-list">
          {featuresData.map((feature, index) => (
            <li className="features-item" key={index}>
              <div className="item-icon">{feature.icon}</div>
              <div>
                <h3 className="h4 item-title">{feature.title}</h3>
                <p className="item-text">{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Features;
