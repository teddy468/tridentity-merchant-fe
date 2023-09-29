import { trim } from "lodash";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomTabs from "../../commons/components/CustomTabs";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import { BADGE_MANAGEMENT_URL } from "../../commons/constants/api-urls";
import { BadgeStatusEnum } from "../../commons/constants/product";
import { navigations } from "../../commons/constants/routers";
import defaultAxios from "../../commons/utils/axios";
import { AppContext } from "../../contexts/AppContext";
import BadgeCard from "./BadgeCard";
import styles from "./badges-management.module.scss";

const BadgesManagementComp: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentStore, store, currentStore } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  const [activeTab, setActiveTab] = useState(BadgeStatusEnum.ACTIVE.toString());

  const [listBadge, setListBadge] = useState([]);
  const [listBadgeDraft, setListBadgeDraft] = useState([]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  useEffect(() => {
    if (storeId) {
      getListBadge(BadgeStatusEnum.ACTIVE);
      getListBadge(BadgeStatusEnum.DRAFT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const handleClick = (id: number) => {
    navigate(navigations.STORES.UPDATE_BADGE(storeId as string, id));
  };

  const getListBadge = async (status: number) => {
    try {
      const res = await defaultAxios.get<any>(BADGE_MANAGEMENT_URL(storeId as string), {
        params: {
          status,
        },
      });
      if (status === BadgeStatusEnum.ACTIVE) {
        setListBadge(res.data);
      } else {
        setListBadgeDraft(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const Tabs = [
    {
      title: "Published",
      key: BadgeStatusEnum.ACTIVE.toString(),
      children: <span>{`(${listBadge.length})`}</span>,
    },

    {
      title: "Draft",
      key: BadgeStatusEnum.DRAFT.toString(),
      children: <span>{`(${listBadgeDraft.length})`}</span>,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{`${trim(currentStore?.name)} - Badge Management`}</div>
        <PrimaryButton
          className={styles.addProductBtn}
          onClick={() => navigate(navigations.STORES.CREATE_BADGE(currentStore?.id || ""))}
        >
          Create badge
        </PrimaryButton>
      </div>
      <div className={styles.productPanel}>
        <CustomTabs tabStyle={styles.customTab} activeTab={activeTab} onChange={handleTabChange} tabs={Tabs}>
          <div className={styles.stores}>
            {(activeTab === BadgeStatusEnum.ACTIVE.toString() ? listBadge : listBadgeDraft).map(
              (store: any, index: number) => {
                return (
                  <BadgeCard
                    key={index}
                    storeName={store.name}
                    image={store.image}
                    onClick={() => {
                      handleClick(store.id);
                    }}
                  />
                );
              }
            )}
          </div>
        </CustomTabs>
      </div>
    </div>
  );
};

export default BadgesManagementComp;
