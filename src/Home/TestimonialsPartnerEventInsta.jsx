import React from "react";
import { useTranslation } from "react-i18next";
import "./assets/css/style.css";

const TestimonialsPartnerEventInsta = () => {
  const { t } = useTranslation();

  const events = t("testimonials.events", { returnObjects: true });

  return (
    <>
      {/* Testimonials Section */}
      <section className="testi">
        <div className="testi-content">
          <p className="section-subtitle">
            <img src="./assets/images/subtitle-img-green.png" width="32" height="7" alt="Wavy line" />
            <span>{t("testimonials.subtitle")}</span>
          </p>
          <h2 className="h2 section-title">
            {t("testimonials.title")} <strong>{t("testimonials.strong")}</strong>
          </h2>
          <div className="testi-card">
            <div>
              <blockquote className="testi-text">
                {t("testimonials.paragraph")}
              </blockquote>
            </div>
          </div>
        </div>
        <figure className="testi-banner">
          <img
            src="https://www.haguefasteners.co.uk/wp-content/uploads/2021/10/freenaturestock-1725-1024x683.jpg"
            width="960"
            height="846"
            loading="lazy"
            alt="Nature"
            className="img-cover"
          />
        </figure>
      </section>

      {/* Event Section */}
      <section className="section event" id="event">
        <div className="container">
          <p className="section-subtitle">
            <img src="./assets/images/subtitle-img-green.png" width="32" height="7" alt="Wavy line" />
            <span>{t("testimonials.services")}</span>
            <img src="./assets/images/subtitle-img-green.png" width="32" height="7" alt="Wavy line" />
          </p>
          <h2 className="h2 section-title">
            {t("testimonials.our")} <strong>{t("testimonials.servicesStrong")}</strong>
          </h2>

          <ul className="event-list">
            {events.map((event, i) => (
              <li key={i}>
                <div className="event-card">
                  <time className="card-time" dateTime={event.date}>
                    <span className="month">{event.month || ""}</span>
                    <span className="date">{event.day}</span>
                  </time>
                  <div className="wrapper">
                    <div className="card-content">
                      <p className="card-subtitle">{event.title}</p>
                      <h3 className="card-title">{event.heading}</h3>
                      <p className="card-text">{event.paragraph}</p>
                    </div>
                    <button className="btn btn-white">
                      <span>{t("testimonials.join")}</span>
                      <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button className="btn btn-secondary">
            <span>{t("testimonials.learnMore")}</span>
            <ion-icon name="heart-outline" aria-hidden="true"></ion-icon>
          </button>
        </div>
      </section>
    </>
  );
};

export default TestimonialsPartnerEventInsta;
