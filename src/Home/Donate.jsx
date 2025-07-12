import React from "react";
import { IoHeartOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import "./assets/css/style.css";

const donateItems = [
  {
    img: "https://img1.wsimg.com/isteam/stock/104776/:/cr=t:0%25,l:5.67%25,w:88.67%25,h:100%25/rs=w:600,h:451.12781954887214,cg:true"
  },
  {
    img: "https://scx2.b-cdn.net/gfx/news/2022/the-economic-benefits.jpg"
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxiqfY-6SF7HXWI-qhQv_8UfLY48k-T1m4IJL-uporwqrd1hOWmmKdD9nt3U9eF7GeLZI&usqp=CAU"
  },
  {
    img: "https://png.pngtree.com/thumb_back/fh260/background/20230806/pngtree-a-waterfall-of-plants-covered-in-green-moss-image_12983506.jpg"
  }
];

const DonateSection = () => {
  const { t } = useTranslation();
  const translatedItems = t("donate.items", { returnObjects: true });

  return (
    <section className="section donate" id="donate">
      <div className="container">
        <ul className="donate-list">
          {translatedItems.map((item, index) => (
            <li key={index}>
              <div className="donate-card">
                <figure className="card-banner">
                  <img
                    src={donateItems[index].img}
                    width="520"
                    height="325"
                    loading="lazy"
                    alt={item.heading}
                    className="img-cover"
                  />
                </figure>
                <div className="card-content">
                  <div className="progress-wrapper">
                    <p className="progress-text">
                      <data value="256">{item.heading}</data>
                    </p>
                  </div>

                  <div className="card-wrapper">
                    <p className="card-wrapper-text">
                      <data className="green">{item.paragraph}</data>
                    </p>
                  </div>

                  <button className="btn btn-secondary">
                    <span>{t("donate.button")}</span>
                    <IoHeartOutline aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DonateSection;
