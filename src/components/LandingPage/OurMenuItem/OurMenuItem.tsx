import React, { useRef } from "react";
import styles from "./our-menu-item.module.scss";
import { Col, Row } from "antd";


const OurMenuItem = () => {

  return (
    <>
      <Row gutter={24}>
        <Col span={8} >
          <div className={styles.coverOurMenuItem}  style={{ 'backgroundImage': `url('https://www.visitsingapore.com/editorials/did-you-know-foodies/_jcr_content.renderimage.carousel.rect.835.470.jpg')` }}>
            <div className={styles.coverTitle}>
              <h4>Office Catering</h4>
              <p>Whether you’re hosting clients, planning a work event or feeding your team</p>
            </div>
          </div>
        </Col>
        <Col span={8} >
          <div className={styles.coverOurMenuItem}  style={{ 'backgroundImage': `url('https://hips.hearstapps.com/hmg-prod/images/190410-flan-173-1555947946.jpg?crop=1.00xw:0.752xh;0,0.157xh&resize=1200:*')` }}>
            <div className={styles.coverTitle}>
              <h4>Office Catering</h4>
              <p>Whether you’re hosting clients, planning a work event or feeding your team</p>
            </div>
          </div>
        </Col> <Col span={8} >
        <div className={styles.coverOurMenuItem}  style={{ 'backgroundImage': `url('https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/content6553.jpg')` }}>
          <div className={styles.coverTitle}>
            <h4>Office Catering</h4>
            <p>Whether you’re hosting clients, planning a work event or feeding your team</p>
          </div>
        </div>
      </Col> <Col span={8} >
        <div className={styles.coverOurMenuItem}  style={{ 'backgroundImage': `url('https://hips.hearstapps.com/hmg-prod/images/190410-flan-173-1555947946.jpg?crop=1.00xw:0.752xh;0,0.157xh&resize=1200:*')` }}>
          <div className={styles.coverTitle}>
            <h4>Office Catering</h4>
            <p>Whether you’re hosting clients, planning a work event or feeding your team</p>
          </div>
        </div>
      </Col>
        <Col span={8} >
          <div className={styles.coverOurMenuItem}  style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}>
            <div className={styles.coverTitle}>
              <h4>Office Catering</h4>
              <p>Whether you’re hosting clients, planning a work event or feeding your team</p>
            </div>
          </div>
        </Col><Col span={8} >
        <div className={styles.coverOurMenuItem}  style={{ 'backgroundImage': `url('https://epic-j.com/wp-content/uploads/sites/2/2019/10/Chinese_cuisine.jpg')` }}>
          <div className={styles.coverTitle}>
            <h4>Office Catering</h4>
            <p>Whether you’re hosting clients, planning a work event or feeding your team</p>
          </div>
        </div>
      </Col>

      </Row>
    </>
  );
};

export default OurMenuItem;
