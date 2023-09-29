import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_STORE_REJECTED_URL, GET_STORE_UPDATE_REJECTED_URL } from "../../commons/constants/api-urls";
import defaultAxios from "../../commons/utils/axios";
import { STORETAB } from ".";
import styles from "./store-management.module.scss";
import { Store } from "../../commons/resources";
import { routers } from "../../commons/constants/routers";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import StoreCard from "./StoreCard";

interface Props {
  activeTab: string;
}

const StoreRejected: React.FC<Props> = ({ activeTab }) => {
  const navigate = useNavigate();
  const [listStore, setListStore] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getListStorePending() {
    setLoading(true);
    try {
      const createRejected = await defaultAxios.get(GET_STORE_REJECTED_URL, {
        params: {
          pageSize: 100,
          perPage: 100,
        },
      });
      const updateRejected = await defaultAxios.get(GET_STORE_UPDATE_REJECTED_URL, {
        params: {
          pageSize: 100,
          perPage: 100,
        },
      });

      const totalRejected = createRejected.data.concat(updateRejected.data);
      setListStore(totalRejected);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === STORETAB.REJECTED.toString()) getListStorePending();
  }, [activeTab]);

  return (
    <div>
      {" "}
      {!loading ? (
        listStore.length === 0 ? (
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
              {listStore.map((store: Store, index: number) => (
                <StoreCard key={index} storeName={store.name} image={store.logo} />
              ))}
            </div>
          </>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default StoreRejected;
