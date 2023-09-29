import React, { useState } from "react";
import styles from "./custom-icon-star.module.scss";
import { FilledStarIcon, StarIcon } from "../../commons/resources";

interface CustomIconStarProps {
  isFeatured: boolean;
  id: number | string;
  onClick: (id: number | string, isFeatured: boolean) => void;
}

const CustomIconStar = (props: CustomIconStarProps) => {
  const { isFeatured, onClick, id } = props;
  const [isChecked, setIsChecked] = useState(isFeatured);

  return (
    <div
      className={styles.checkbox}
      onClick={() => {
        setIsChecked(!isChecked);
        onClick(id, isFeatured);
      }}
      onMouseDown={event => {
        if (event.detail > 1) {
          event.preventDefault();
        }
      }}
    >
      {isChecked ? (
        <FilledStarIcon />
      ) : (
        <div className={styles.outlineIcon}>
          <StarIcon />
        </div>
      )}
    </div>
  );
};

export default CustomIconStar;
