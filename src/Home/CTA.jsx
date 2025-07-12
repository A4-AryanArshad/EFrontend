import React from "react";
import { IoHeartOutline } from "react-icons/io5";
import ctaImage from "./assets/images/cta-banner.jpg";
import "./assets/css/style.css";

const CTA = () => {
  return (
    <section className="section cta">
      <div className="container">
        <div className="cta-content">
          <h2 className="h2 section-title">324+ Trusted Global Partners</h2>
          <button className="btn btn-outline">
            <span>Become a Partner</span>
            <IoHeartOutline aria-hidden="true" />
          </button>
        </div>

        <figure className="cta-banner">
          <img
            src={ctaImage}
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

export default CTA;
