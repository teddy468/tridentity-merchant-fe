import React from "react";
import dot from "../../../assets/icons/threeDot.svg";
import styles from "./store-card.module.scss";

import { STORE_STATUS } from "../../../commons/constants/store";
interface props {
  status: STORE_STATUS;
  storeId?: number;
  handleOpenModal: () => void;
}
const StatusStore: React.FC<props> = ({ status, storeId, handleOpenModal }) => {
  return (
    <div className={styles.statusBox}>
      <div className={`${styles.status} ${status === STORE_STATUS.LIVE ? styles.active : styles.suspend}`}>
        {status === STORE_STATUS.LIVE ? "Active" : status === STORE_STATUS.SUSPENDED ? "Off" : "Closed"}
      </div>
      {storeId && (
        <div
          onClick={e => {
            e.stopPropagation();
            handleOpenModal();
          }}
          className={styles.dotIconWrapper}
        >
          <img src={dot} alt="dot" className={styles.dotIcon} />
        </div>
      )}
    </div>
  );
};

export default StatusStore;
