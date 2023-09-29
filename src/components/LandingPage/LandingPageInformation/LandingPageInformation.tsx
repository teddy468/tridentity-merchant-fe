import React, { useRef, useState } from "react";
import styles from "./landing-page-information.module.scss";
import { Col, Rate, Row } from "antd";
import { MessageIcon, HeardBoldIcon, SearchIcon, HeardIcon } from "../../../assets/icons";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const LandingPageInformation = () => {
  const [value, setValue] = useState(3);
  const [favorite, setFavorite] = useState<boolean>(false);

  return (
    <div className={styles.landingPageInfo}>
      <div className={styles.landingPageInfoTitle}>
        <div className={styles.storeName}>
          <h3>Chedi restaurant</h3>
          <span>
            <Rate tooltips={desc} onChange={setValue} value={value} />
          </span>
          <span className={styles.textReview}>10,098 reviews</span>
        </div>

        <span className={styles.favoriteButton}>
          <MessageIcon />
        </span>

        <span
          className={favorite ? styles.favoriteButtonActive : styles.favoriteButton}
          onClick={() => setFavorite(!favorite)}
        >
          {favorite ? <HeardBoldIcon /> : <HeardIcon />}
        </span>
      </div>
      <Row className={styles.mb40px}>
        <Col span={8}>
          <p>Opening hours</p>
          <h4>08:00 - 21:00</h4>
          <p>Service support</p>
          <h4>Delivery, Pickup, Dine in</h4>
        </Col>
        <Col span={8}>
          <p>Address</p>
          <h4>4517 Washington Ave. Manchester, Kentucky 39495</h4>
        </Col>
        <Col span={8}></Col>
      </Row>

      <CustomInput className={styles.search} placeholder="Search for items" prefix={<SearchIcon />} />
    </div>
  );
};

export default LandingPageInformation;
