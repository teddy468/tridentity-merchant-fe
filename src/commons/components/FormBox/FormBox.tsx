import React from "react";
import styles from "./FormBox.module.scss";

type Props = {
  title?: React.ReactNode;
  children?: React.ReactNode | React.ReactNode[];
};

const FormBox: React.FC<Props> = ({ title, children }) => {
  return (
    <div className={styles.box}>
      {title && <div className={styles.title}>{title}</div>}
      {children}
    </div>
  );
};

export default FormBox;
