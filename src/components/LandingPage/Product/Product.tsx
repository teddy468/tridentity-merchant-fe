import React, { useRef } from "react";
import styles from "./product.module.scss";
import { Col, Row } from "antd";


const Product = () => {

  return (
    <>
      <Row gutter={24}>
        <Col span={6} >
          <div className={styles.coverProduct}>
            <span className={styles.tag}>Hot</span>
            <div className={styles.coverImg}
                 style={{ "backgroundImage": `url('https://picsum.photos/seed/picsum/200/300')` }}></div>
            <div className={styles.coverProductInfor}>
              <h4>Pappardelle Aux Cépes (Vegetarian)</h4>
              <p>Putra Minang Restaurant</p>
              <span>S$ 9.50</span>
            </div>
            <div className={styles.addToCart}>
              Add to cart
            </div>
          </div>
        </Col>
        <Col span={6} >
          <div className={styles.coverProduct}>
            <span className={styles.tag}>Hot</span>
            <div className={styles.coverImg}
                 style={{ "backgroundImage": `url('https://picsum.photos/seed/picsum/200/300` }}></div>
            <div className={styles.coverProductInfor}>
              <h4>Pappardelle Aux Cépes (Vegetarian)</h4>
              <p>Putra Minang Restaurant</p>
              <span>$ 9.50</span>
            </div>
            <div className={styles.addToCart}>
              Add to cart
            </div>
          </div>
        </Col>
        <Col span={6} >
          <div className={styles.coverProduct}>
            <span className={styles.tag}>Hot</span>
            <div className={styles.coverImg}
                 style={{ "backgroundImage": `url('https://picsum.photos/seed/picsum/200/300')` }}></div>
            <div className={styles.coverProductInfor}>
              <h4>Pappardelle Aux Cépes (Vegetarian)</h4>
              <p>Putra Minang Restaurant</p>
              <span>$ 9.50</span>
            </div>
            <div className={styles.addToCart}>
              Add to cart
            </div>
          </div>
        </Col>
        <Col span={6} >
          <div className={styles.coverProduct}>
            <span className={styles.tag}>Hot</span>
            <div className={styles.coverImg}
                 style={{ "backgroundImage": `url('https://picsum.photos/seed/picsum/200/300')` }}></div>
            <div className={styles.coverProductInfor}>
              <h4>Pappardelle Aux Cépes (Vegetarian)</h4>
              <p>Putra Minang Restaurant</p>
              <span>$ 9.50</span>
            </div>
            <div className={styles.addToCart}>
              Add to cart
            </div>
          </div>
        </Col>

      </Row>
    </>
  );
};

export default Product;
