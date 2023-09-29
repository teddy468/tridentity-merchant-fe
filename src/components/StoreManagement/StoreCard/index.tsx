import { STORE_STATUS } from "../../../commons/constants/store";
import styles from "./store-card.module.scss";
import { useState } from "react";
import defaultAxios from "../../../commons/utils/axios";
import { CHANGE_STORE_STATUS_URL } from "../../../commons/constants/api-urls";
import { message } from "antd";
import PopupStatus from "./PopupStatus";
import StatusStore from "./StatusStore";
import PopupStatusMember from "./PopupStatusMember";
interface StoreCardProps extends React.HTMLAttributes<HTMLDivElement> {
  storeName: string;
  image: string;
  storeId?: number;
  className?: string;
  status?: STORE_STATUS;
  refresh?: () => void;
  storeIdManageByMember?: number;
}
const StoreCard: React.FC<StoreCardProps> = ({
  storeName,
  image,
  className,
  status,
  storeId,
  refresh,
  storeIdManageByMember,
  ...props
}: StoreCardProps) => {
  const [openPopup, setOpenPopup] = useState(false);

  function handleOpenModal() {
    setOpenPopup(!openPopup);
  }

  async function handleOpenStore(storeId: number) {
    try {
      await defaultAxios.patch(CHANGE_STORE_STATUS_URL(storeId), { status: STORE_STATUS.LIVE });
      message.success("Open store successfully");
      refresh && refresh();
    } catch (error) {
      console.log(error);
      message.error("Close store failed");
    }
  }
  async function handleCloseStore(storeId: number) {
    try {
      await defaultAxios.patch(CHANGE_STORE_STATUS_URL(storeId), { status: STORE_STATUS.CLOSED });
      message.success("Close store successfully");
      refresh && refresh();
    } catch (error) {
      console.log(error);
      message.error("Close store failed");
    }
  }

  async function handleOffStore(storeId: number) {
    try {
      await defaultAxios.patch(CHANGE_STORE_STATUS_URL(storeId), { status: STORE_STATUS.SUSPENDED });
      message.success("Off store successfully");
      refresh && refresh();
    } catch (error) {
      console.log(error);
      message.error("Close store failed");
    }
  }

  return (
    <div
      className={[styles.wrapper, className].join(" ")}
      {...props}
      onMouseLeave={() => {
        setOpenPopup(false);
      }}
    >
      <img src={image} alt="store" />

      <div className={styles.name}>{storeName}</div>

      {status?.toString() && storeId && (
        <>
          <StatusStore status={status} storeId={storeId} handleOpenModal={handleOpenModal} />
          {storeIdManageByMember ? (
            <>
              {openPopup && (
                <PopupStatusMember
                  status={status}
                  storeId={storeId}
                  handleCloseStore={handleCloseStore}
                  handleOffStore={handleOffStore}
                  handleOpenStore={handleOpenStore}
                />
              )}
            </>
          ) : (
            <>
              {openPopup && (
                <PopupStatus
                  status={status}
                  storeId={storeId}
                  handleCloseStore={handleCloseStore}
                  handleOffStore={handleOffStore}
                  handleOpenStore={handleOpenStore}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StoreCard;
