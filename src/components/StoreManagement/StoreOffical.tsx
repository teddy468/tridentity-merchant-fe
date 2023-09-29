import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import { navigations, routers } from "../../commons/constants/routers";
import styles from "./store-management.module.scss";
import { Store } from "../../commons/resources";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import StoreCard from "./StoreCard";
import { STORETAB } from ".";
import { Spin } from "antd";
import { MODES } from "../../commons/constants/user";

interface Props {
  activeTab: string;
}
const StoreOffical: React.FC<Props> = ({ activeTab }) => {
  const { store, setCurrentStore, user } = useContext(AppContext);
  const navigate = useNavigate();
  const { data, loading, refresh } = store;
  const storeIdManageByMember = user?.merchantStoreAuthorities?.[0]?.merchantStore?.id;

  useEffect(() => {
    if (activeTab === STORETAB.OFFICIAL.toString()) {
      refresh();
    }
  }, [activeTab]);

  const onSelectStore = (store: Store) => {
    setCurrentStore(store);
    navigate(navigations.STORES.STORE_DASHBOARD(store.id));
  };

  if (user?.merchant_role?.id === MODES.ADMIN) {
    return (
      <div className={styles.storeContainer}>
        {!loading ? (
          data?.length === 0 ? (
            <div className={styles.emptyList}>
              <img className={styles.image} src={Store} alt="store" />
              <div className={styles.title}>You haven’t manage a store yet</div>
              <div className={styles.description}>It’s time to create your store!</div>
              <PrimaryButton className={styles.createStoreBtn} onClick={() => navigate(routers.STORES.CREATE_STORE)}>
                Create store
              </PrimaryButton>
            </div>
          ) : (
            <>
              <div className={styles.stores}>
                {data?.map((store: Store, index: number) => {
                  return (
                    <StoreCard
                      key={index}
                      storeName={store.name}
                      image={store.logo}
                      onClick={() => onSelectStore(store)}
                      status={store.status}
                      storeId={store.id}
                      refresh={refresh}
                    />
                  );
                })}
              </div>
            </>
          )
        ) : (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className={styles.storeContainer}>
        {!loading ? (
          <div className={styles.stores}>
            {data
              ?.filter(item => item.id === storeIdManageByMember)
              .map((store: Store, index: number) => {
                return (
                  <StoreCard
                    key={index}
                    storeName={store.name}
                    image={store.logo}
                    onClick={() => onSelectStore(store)}
                    status={store.status}
                    storeId={store.id}
                    refresh={refresh}
                    storeIdManageByMember={storeIdManageByMember}
                  />
                );
              })}
          </div>
        ) : (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        )}
      </div>
    );
  }
};

export default StoreOffical;
