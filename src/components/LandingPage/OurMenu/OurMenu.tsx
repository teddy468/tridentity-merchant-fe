import React, { useRef } from "react";
import styles from "../ProductView/product-view.module.scss";
import { ArrowRightYellowIcon } from "../../../assets/icons";
import OurMenuItem from "../OurMenuItem/OurMenuItem";


const OurMenu = () => {

  return (
    <>
      <div className={styles.featuredDishes}>
        <h3>Our menu</h3>
        <span className={styles.viewAll}>
            View all menu
          </span>
        <ArrowRightYellowIcon />
      </div>
      <OurMenuItem/>
    </>
  );
};

export default OurMenu;
