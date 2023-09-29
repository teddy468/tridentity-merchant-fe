import React from "react";
import { STORE_STATUS } from "../../../commons/constants/store";
import styles from "./store-card.module.scss";
interface props {
  storeId: number;
  status: STORE_STATUS;
  handleOffStore: (storeId: number) => void;
  handleOpenStore: (storeId: number) => void;
  handleCloseStore: (storeId: number) => void;
}
const PopupStatus: React.FC<props> = ({ status, storeId, handleCloseStore, handleOffStore, handleOpenStore }) => {
  if (status === STORE_STATUS.LIVE) {
    return (
      <div className={styles.btnAction}>
        <p
          onClick={e => {
            e.stopPropagation();
            handleOffStore(storeId);
          }}
        >
          Off
        </p>
        <p
          onClick={e => {
            e.stopPropagation();
            handleCloseStore(storeId);
          }}
        >
          Close
        </p>
      </div>
    );
  } else if (status === STORE_STATUS.SUSPENDED) {
    return (
      <div className={styles.btnAction}>
        <p
          onClick={e => {
            e.stopPropagation();
            handleOpenStore(storeId);
          }}
        >
          Open
        </p>
        <p
          onClick={e => {
            e.stopPropagation();
            handleCloseStore(storeId);
          }}
        >
          Close
        </p>
      </div>
    );
  } else {
    return (
      <div className={styles.btnAction}>
        <p
          onClick={e => {
            e.stopPropagation();
            handleOpenStore(storeId);
          }}
        >
          Open
        </p>
        <p
          onClick={e => {
            e.stopPropagation();
            handleOffStore(storeId);
          }}
        >
          Off
        </p>
      </div>
    );
  }
};

export default PopupStatus;
