import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import { routers } from "../../commons/constants/routers";
import { AppContext } from "../../contexts/AppContext";
import styles from "./store-management.module.scss";
import useControlTabs from "../../hooks/useControlTabs";
import CustomTabs from "../../commons/components/CustomTabs";
import StoreOffical from "./StoreOffical";
import StorePending from "./StorePending";
import StoreRejected from "./StoreRejected";
import { MODES } from "../../commons/constants/user";

export enum STORETAB {
  OFFICIAL = "1",
  PENDING = "2",
  REJECTED = "3",
}
const StoreManagement = () => {
  const { user } = useContext(AppContext);
  const { activeTab, onChange } = useControlTabs(STORETAB.OFFICIAL.toString());
  const navigate = useNavigate();
  const isAdmin = user?.merchant_role?.id === MODES.ADMIN;

  const Tabs = [
    { title: "Official Store", key: STORETAB.OFFICIAL.toString(), children: <div></div> },
    { title: "Pending Store", key: STORETAB.PENDING.toString(), children: <div></div> },
    { title: "Rejected Store", key: STORETAB.REJECTED.toString(), children: <div></div> },
  ];

  if (isAdmin) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>Store List</div>
          <PrimaryButton className={styles.createStoreBtn} onClick={() => navigate(routers.STORES.CREATE_STORE)}>
            Create store
          </PrimaryButton>
        </div>
        <CustomTabs
          tabStyle={styles.customTab}
          className={"tabProduct"}
          activeTab={activeTab}
          onChange={onChange}
          tabs={Tabs}
        >
          {" "}
          <div className={styles.tabContent}>
            {activeTab === STORETAB.OFFICIAL.toString() && (
              <div>
                <StoreOffical activeTab={activeTab} />
              </div>
            )}
            {activeTab === STORETAB.PENDING.toString() && <StorePending activeTab={activeTab} />}

            {activeTab === STORETAB.REJECTED.toString() && (
              <div>
                <StoreRejected activeTab={activeTab} />
              </div>
            )}
          </div>
        </CustomTabs>
      </div>
    );
  } else {
    return (
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>Store List</div>
        </div>
        <StoreOffical activeTab={activeTab} />
      </div>
    );
  }
};

export default StoreManagement;
