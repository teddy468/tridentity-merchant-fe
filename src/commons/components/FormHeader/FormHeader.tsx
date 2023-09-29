import React from "react";
import styles from "./FormHeader.module.scss";

type Props = {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  note?: React.ReactNode;
};

const FormHeader: React.FC<Props> = ({ title, actions, note }) => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      <div className={styles.actions}>{actions}</div>
      {note && <div className={styles.note}>{note}</div>}
    </div>
  );
};

export default FormHeader;
