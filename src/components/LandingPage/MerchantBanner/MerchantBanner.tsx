import React, { useRef } from "react";
import styles from "./merchant-banner.module.scss";
import { Carousel } from "antd";

type Props = {
  banners: Store["banners"];
};

const MerchantStoreBanner = ({ banners }: Props) => {
  const drag = useRef<boolean>(false);

  return (
    <>
      <Carousel autoplay >
        {banners.map((image, index) => {
          return (
            <div key={index} className={styles.eachSlideEffect} >
              <img src={image} alt="" />
            </div>
          );
        })}
      </Carousel>
      <div className={styles.sliderLandingPage}>
        <div className={styles.coverImage}  style={{ 'backgroundImage': `url('https://a.cdn-hotels.com/gdcs/production12/d29/cc49915a-a856-4e94-9ba4-c7e89a652d2e.jpg?impolicy=fcrop&w=1600&h=1066&q=medium')` }}></div>
      </div>
    </>
  );
};

export default MerchantStoreBanner;
