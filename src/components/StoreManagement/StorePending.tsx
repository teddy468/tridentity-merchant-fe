import React, { useEffect, useState } from "react";
import defaultAxios from "../../commons/utils/axios";
import { GET_STORE_REQUEST_URL, GET_STORE_UPDATE_REQUEST_URL } from "../../commons/constants/api-urls";
import { STORETAB } from ".";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import styles from "./store-management.module.scss";
import StoreCard from "./StoreCard";
import { useNavigate } from "react-router-dom";
import { Store } from "../../commons/resources";
import { routers } from "../../commons/constants/routers";

interface Props {
  activeTab: string;
}
const StorePending: React.FC<Props> = ({ activeTab }) => {
  const navigate = useNavigate();
  const [listStore, setListStore] = React.useState([]);
  const [loading, setLoading] = useState(false);

  async function getListStorePending() {
    setLoading(true);
    try {
      const createStore = await defaultAxios.get(GET_STORE_REQUEST_URL, {
        params: {
          pageSize: 100,
          perPage: 100,
        },
      });
      const updateStore = await defaultAxios.get(GET_STORE_UPDATE_REQUEST_URL, {
        params: {
          pageSize: 100,
          perPage: 100,
        },
      });
      const totalStore = createStore.data.concat(updateStore.data);
      setListStore(totalStore);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === STORETAB.PENDING.toString()) getListStorePending();
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

export default StorePending;
