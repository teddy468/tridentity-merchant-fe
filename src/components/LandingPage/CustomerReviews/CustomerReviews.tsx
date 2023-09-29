import React, { useRef } from "react";
import styles from "../ProductView/product-view.module.scss";
import { ArrowRightYellowIcon } from "../../../assets/icons";
import CustomerReviewsItem from "../CustomerReviewsItem/CustomerReviewsItem";

type Props = {
  title: string;
};


const CustomerReviews = () => {

  return (
    <>
      <div className={styles.featuredDishes}>
        <h3>Customer reviews</h3>
        <span className={styles.viewAll}>
           View all
          </span>
        <ArrowRightYellowIcon />
      </div>
      <CustomerReviewsItem/>
    </>
  );
};

export default CustomerReviews;
