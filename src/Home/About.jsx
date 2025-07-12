import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoCheckmarkCircle,
  IoHeartOutline,
} from "react-icons/io5";

import subtitleImage from "./assets/images/subtitle-img-green.png";
import decoImg from "./assets/images/deco-img.png";
import "./assets/css/style.css";

const About = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("mission");

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const tabKeys = ["mission", "vision", "nextPlan"];

  return (
    <section className="section about" id="about">
      <div className="container">
        {/* ABOUT BANNER */}
        <div className="about-banner">
          <h2 className="deco-title"></h2>
          <img src={decoImg} width="58" height="261" alt="" className="deco-img" />

          <div className="banner-row">
            <div className="banner-col">
              <img
                id="one"
              src="https://images.unsplash.com/photo-1611270418597-a6c77f4b7271?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FyYm9uJTIwZW1pc3Npb25zfGVufDB8fDB8fHww"
                width="315"
                height="380"
                loading="lazy"
                alt="Sustainability"
                className="about-img w-100"
              />
              <img
                id="one"
                                         src="https://media.istockphoto.com/id/2191769066/photo/tree-shaped-man-in-natural-life.jpg?s=612x612&w=0&k=20&c=vdm5JhFtX9liZTvrgwr496_yyotKdpRLZME3yVa5wps="
                width="386"
                height="250"
                loading="lazy"
                alt="Green Future"
                className="about-img about-img-2 w-100"
              />
            </div>

            <div className="banner-col">
              <img
                id="one"
        src="https://media.istockphoto.com/id/1184253348/photo/footprint-in-the-forest.jpg?s=612x612&w=0&k=20&c=ao-NlQ0-l8rElYT-uTKccF4TWfEjUlgC1eBdN-C41MU="
                width="250"
                height="277"
                loading="lazy"
                alt="Footprint"
                className="about-img about-img-3 w-100"
              />
              <img
                id="one"
                src="https://img.freepik.com/free-photo/factory-producing-co2-pollution_23-2150858367.jpg"
                width="315"
                height="380"
                loading="lazy"
                alt="CO2 Emissions"
                className="about-img w-100"
              />
            </div>
          </div>
        </div>

        {/* ABOUT CONTENT */}
        <div className="about-content">
          <p className="section-subtitle">
            <img src={subtitleImage} width="32" height="7" alt="Wavy line" />
            <span>{t("about.subtitle")}</span>
          </p>

          <h2 className="h2 section-title">
            {t("about.title.part1")} <strong>{t("about.title.part2")}</strong>
          </h2>

          {/* TAB NAV */}
          <ul className="tab-nav">
            {tabKeys.map((key) => (
              <li key={key}>
                <button
                  className={`tab-btn ${activeTab === key ? "active" : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  {t(`about.tabs.${key}.title`)}
                </button>
              </li>
            ))}
          </ul>

          {/* TAB CONTENT */}
          <div className="tab-content">
            <p className="section-text">{t(`about.tabs.${activeTab}.text`)}</p>

            <ul className="tab-list">
              <li className="tab-item">
                <div className="item-icon"><IoCheckmarkCircle /></div>
                <p className="tab-text">{t("about.points.0")}</p>
              </li>
              <li className="tab-item">
                <div className="item-icon"><IoCheckmarkCircle /></div>
                <p className="tab-text">{t("about.points.1")}</p>
              </li>
              <li className="tab-item">
                <div className="item-icon"><IoCheckmarkCircle /></div>
                <p className="tab-text">{t("about.points.2")}</p>
              </li>
              <li className="tab-item">
                <div className="item-icon"><IoCheckmarkCircle /></div>
                <p className="tab-text">{t("about.points.3")}</p>
              </li>
            </ul>

            <button className="btn btn-secondary">
              <span>{t("about.learn_more")}</span>
              <IoHeartOutline />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
