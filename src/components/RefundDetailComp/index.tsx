import { Avatar, Rate } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { AvatarSvg } from "../../assets/icons";
import { routers } from "../../commons/constants/routers";
import "./index.scss";
import styles from "./product-management.module.scss";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import useFetch from "../../commons/hooks/useFetch";
import { REFUND_PUT_STATUS_URL, REFUND_REQUEST_DETAIL_URL, UPDATE_PRODUCT_URL } from "../../commons/constants/api-urls";
import moment from "moment";
import { Button, Space } from 'antd';
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import notFound from "../../pages/NotFound";
import defaultAxios from "../../commons/utils/axios";
import useToast from "../../commons/hooks/useToast";
import { AxiosError } from "axios";
import get from "lodash/get";

export enum StoreUpdateAction {
  REJECT = 0,
  APPROVE = 1,
}

export enum TransactionsStatus {
  FAILED = 0,
  SUCCEEDED = 1,
  SETTLED = 2,
  REFUNDED = 3,
  PENDING_REFUND = 4,
  REJECTED = 5,
}

const RefundDetailComp: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setCurrentStore, store, currentStore } = useContext(AppContext);
  const [openConfirmPopup, setOpenConfirmPopup] = useState('');

  const { storeId, id } = useParams<{ storeId: string, id: string }>();
  const {data, refresh} = useFetch<RefundRequestDetail>(id ? REFUND_REQUEST_DETAIL_URL(id) : "")

  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const  onConfirm = async (confirm: boolean) => {
    setOpenConfirmPopup("");
    let status = StoreUpdateAction.REJECT
    if (confirm) {
      status = StoreUpdateAction.APPROVE
    }
    try {
      await defaultAxios.put<CreateUpdateProductResponse>(REFUND_PUT_STATUS_URL(id ? id : ""), { "action": status });
      toast.success(confirm ? "Confirm refund success" : "Decline refund success")
      refresh()
    } catch (error: any) {
      const er =  (error as AxiosError<any>)?.response?.data
      const message = get(er, "error.message.[0]", "Request fail")
      toast.error(message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{`Refund request detail`}</div>
        <div className={`${styles.filters} filters`}>
          <div className="pointer" onClick={() => navigate(routers.STORES.REFUND_MANAGEMENT.replace(":storeId", `${currentStore?.id}`))}>
            Back
          </div>
        </div>
      </div>

      <div className={styles.productPanel}>
        <div className={styles.userInfo}>
          <div>
            <Avatar size={80} icon={<img src={data?.recipient.avatar} alt={"avatar"} />} />
          </div>
          <div className={styles.detail}>
            <div className={styles.name}>{data?.recipient.name}</div>
            <div className={styles.time}>{data? moment(data.create_time).format("DD/MM/yyy") : ""}</div>
          </div>
        </div>
        <div className={styles.feedback}>
          {data?.meta.description}
        </div>
        <div className={styles.images}>
          {data?.meta.attachments.map((value, index) => {
            return <img src={value} alt="img" key={index} />
          })}
        </div>
      </div>

      <div className={styles.refundFooter}>
        <Button disabled={data?.status !== TransactionsStatus.PENDING_REFUND} onClick={() => setOpenConfirmPopup('DECLINE')} className={styles.btnDeclineRefund}>Decline Refund</Button>
        <Button disabled={data?.status !== TransactionsStatus.PENDING_REFUND} onClick={() => setOpenConfirmPopup('RESOlVE')} className={styles.btnResolve} type="primary">Resolve</Button>
      </div>

      <ConfirmPopup
        open={openConfirmPopup === "RESOlVE" || openConfirmPopup === "DECLINE"}
        onCancel={() => {
          setOpenConfirmPopup('');
        }}
        title="Confirmation"
        description={`Are you sure you want to ${openConfirmPopup === "RESOlVE" ? 'resolve' : 'decline'} this refund request? `}
        onConfirm={() => {
          onConfirm(openConfirmPopup === "RESOlVE")
        }}
      />
    </div>
  );
};

export default RefundDetailComp;
