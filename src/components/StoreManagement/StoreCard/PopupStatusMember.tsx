import { STORE_STATUS } from "../../../commons/constants/store";
import styles from "./store-card.module.scss";

interface props {
  storeId: number;
  status: STORE_STATUS;
  handleOffStore: (storeId: number) => void;
  handleOpenStore: (storeId: number) => void;
  handleCloseStore: (storeId: number) => void;
}

const PopupStatusMember = ({ status, storeId, handleCloseStore, handleOpenStore }: props) => {
  if (status === STORE_STATUS.LIVE) {
    return (
      <div className={styles.btnActionMember}>
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
    return null;
  } else {
    return (
      <div className={styles.btnActionMember}>
        <p
          onClick={e => {
            e.stopPropagation();
            handleOpenStore(storeId);
          }}
        >
          Open
        </p>
      </div>
    );
  }
};

export default PopupStatusMember;
