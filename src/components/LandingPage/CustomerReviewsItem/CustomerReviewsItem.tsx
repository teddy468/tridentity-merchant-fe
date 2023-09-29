import React, { useRef, useState } from "react";
import styles from "./customer-reviews-item.module.scss";
import { Col, Rate, Row } from "antd";


const CustomerReviewsItem = () => {
  const [value, setValue] = useState(3);

  return (
    <>
      <Row gutter={24}>
        <Col span={8} >
          <div className={styles.coverCustomerReviewsItem}>
              <div className={styles.customerReviewsItemHeader}>
                <div className={styles.avatar} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
                <div className={styles.customerInformation}>
                  <h5>Bessie Cooper</h5>
                  <Rate className={styles.customerRate} onChange={setValue} value={value} />
                  <p>03/04/2023</p>
                </div>
              </div>
            <p className={styles.description}>Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.  nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum</p>

            <Row gutter={16}>
              <Col span={8}>
                <div className={styles.imgReview} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
              </Col>
              <Col span={8}>
                <div className={styles.imgReview} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
              </Col>
              <Col span={8}>
                <div className={styles.imgReview} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={8} >
          <div className={styles.coverCustomerReviewsItem}>
            <div className={styles.customerReviewsItemHeader}>
              <div className={styles.avatar} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
              <div className={styles.customerInformation}>
                <h5>Bessie Cooper</h5>
                <Rate className={styles.customerRate} onChange={setValue} value={value} />
                <p>03/04/2023</p>
              </div>
            </div>
            <p className={styles.description}>Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.  nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum</p>

            <Row gutter={16}>
              <Col span={8}>
                <div className={styles.imgReview} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
              </Col>
              <Col span={8}>
                <div className={styles.imgReview} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
              </Col>
              <Col span={8}>
                <div className={styles.imgReview} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={8} >
          <div className={styles.coverCustomerReviewsItem}>
            <div className={styles.customerReviewsItemHeader}>
              <div className={styles.avatar} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
              <div className={styles.customerInformation}>
                <h5>Bessie Cooper</h5>
                <Rate className={styles.customerRate} onChange={setValue} value={value} />
                <p>03/04/2023</p>
              </div>
            </div>
            <p className={styles.description}>Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.  nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum</p>

            <Row gutter={16}>
              <Col span={8}>
                <div className={styles.imgReview} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
              </Col>
              <Col span={8}>
                <div className={styles.imgReview} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
              </Col>
              <Col span={8}>
                <div className={styles.imgReview} style={{ 'backgroundImage': `url('https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg')` }}></div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default CustomerReviewsItem;
