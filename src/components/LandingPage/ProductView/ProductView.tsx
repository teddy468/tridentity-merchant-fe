import React, { useRef } from "react";
import styles from "./product-view.module.scss";
import { Col, Row } from "antd";
import { ArrowRightYellowIcon } from "../../../assets/icons";
import Product from "../Product/Product";


type Props = {
  title: string;
};


const ProductView = ({ title }: Props) => {

  return (
    <>
      <div className={styles.featuredDishes}>
        <h3>{title}</h3>
        <span className={styles.viewAll}>
            View all
          </span>
        <ArrowRightYellowIcon />
      </div>
      <Product/>
    </>
  );
};

export default ProductView;
