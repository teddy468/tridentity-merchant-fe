import { Pagination, PaginationProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios";
import get from "lodash/get";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  RefundAcceptedIcon,
  RefundAcceptIcon,
  RefundDeclineIcon,
} from "../../assets/icons";
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import CustomTable from "../../commons/components/CustomTable";
import { REFUND_PUT_STATUS_URL, REFUND_REQUEST_URL } from "../../commons/constants/api-urls";
import { routers } from "../../commons/constants/routers";
import useFetchList from "../../commons/hooks/useFetchList";
import useToast from "../../commons/hooks/useToast";
import defaultAxios from "../../commons/utils/axios";
import { AppContext } from "../../contexts/AppContext";
import { StoreUpdateAction, TransactionsStatus } from "../RefundDetailComp";
import "./index.scss";
import styles from "./refund-management.module.scss";
import CustomPagination from "../../commons/components/CustomPagination";

interface DataType {
  id: number;
  customerInfo: { name: string; phone: string; email?: string };
  orderId: string;
  description: string;
  images: string[];
  orderDate: string;
  status: string;
}

const RefundManagementComp: React.FC = () => {
  const navigate = useNavigate();

  const { setCurrentStore, store, currentStore } = useContext(AppContext);
  const [openConfirmPopup, setOpenConfirmPopup] = useState("");
  const [selectRefundId, setSelectRefundId] = useState(0);

  const toast = useToast();

  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const param = { page: page, perPage: perPage, paginationMetadataStyle: "body" };
  const {
    data: dataRefund,
    total,
    refresh,
  } = useFetchList<RefundRequest>(currentStore ? REFUND_REQUEST_URL(currentStore.id) : "", param);

  const onConfirm = async (confirm: boolean) => {
    setOpenConfirmPopup("");
    let status = StoreUpdateAction.REJECT;
    if (confirm) {
      status = StoreUpdateAction.APPROVE;
    }
    try {
      await defaultAxios.put<CreateUpdateProductResponse>(REFUND_PUT_STATUS_URL(selectRefundId ? selectRefundId : ""), {
        action: status,
      });
      toast.success(confirm ? "Confirm refund success" : "Decline refund success");
      setSelectRefundId(0);
      refresh();
    } catch (error: any) {
      setSelectRefundId(0);
      const er = (error as AxiosError<any>)?.response?.data;
      const message = get(er, "error.message.[0]", "Request fail");
      toast.error(message);
    }
  };

  const data: DataType[] = useMemo(() => {
    if (dataRefund) {
      return dataRefund.map((value, index) => {
        const email = value.user ? (value.user.email ? value.user.email : "") : "";
        return {
          id: value.id,
          customerInfo: { name: value.recipient.name, phone: value.recipient.phone, email: email },
          orderDate: value.transaction_date ? moment(value.transaction_date).format("DD/MM/yyyy HH:mm:ss") : "",
          images: value.meta ? value.meta.attachments : [],
          description: value.meta ? value.meta.description : "",
          orderId: value.order_id,
          status: value.status,
        };
      });
    }
    return [];
  }, [dataRefund]);

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
    setPage(current);
    setPerPage(pageSize);
  };

  function pageChange(page: number, pageSize: number) {
    setPage(page);
    setPerPage(pageSize);
  }

  const itemRender = (
    page: number,
    type: "page" | "prev" | "next" | "jump-prev" | "jump-next",
    element: React.ReactNode
  ): React.ReactNode => {
    if (type === "prev") {
      return <ArrowLeftIcon />;
    }
    if (type === "next") {
      return <ArrowRightIcon />;
    }
    if (type === "jump-prev") {
      return <span style={{ color: "#fff" }}>...</span>;
    }
    if (type === "jump-next") {
      return <span style={{ color: "#fff" }}>...</span>;
    }
    return element;
  };

  function onClickDecline(id: number) {
    setOpenConfirmPopup("DECLINE");
    setSelectRefundId(id);
  }

  function onClickResolve(id: number) {
    setOpenConfirmPopup("RESOlVE");
    setSelectRefundId(id);
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Consumer’s info",
      dataIndex: "customerInfo",
      render: (text: { name: string; phone: string; email: string }, record) => {
        return (
          <div
            className="pointer"
            onClick={() =>
              navigate(
                routers.STORES.REFUND_MANAGEMENT_DETAIL.replace(":storeId", `${currentStore?.id}`).replace(
                  ":id",
                  `${record?.id}`
                )
              )
            }
          >
            <div className={styles.consumerInfo}>
              {text.name && text.phone && (
                <>
                  {text.name} <br />
                  {text.phone}
                </>
              )}
              {!(text.name && text.phone) && <>{text.email}</>}
            </div>
          </div>
        );
      },
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      render: (text, record) => {
        return (
          <div
            className="pointer"
            onClick={() =>
              navigate(
                routers.STORES.REFUND_MANAGEMENT_DETAIL.replace(":storeId", `${currentStore?.id}`).replace(
                  ":id",
                  `${record?.id}`
                )
              )
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Refund reason",
      dataIndex: "description",
      render: (text, record) => {
        return (
          <div
            className="pointer"
            onClick={() =>
              navigate(
                routers.STORES.REFUND_MANAGEMENT_DETAIL.replace(":storeId", `${currentStore?.id}`).replace(
                  ":id",
                  `${record?.id}`
                )
              )
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Evidence",
      dataIndex: "images",
      width: 240,
      render: (image: string[], record) => {
        return (
          <div className={styles.images}>
            {image &&
              image.map((value, index) => {
                return <img src={value} alt="img" key={index} />;
              })}
          </div>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      render: (text, record) => {
        console.log({ text, record });
        return (
          <div
            className="pointer"
            onClick={() =>
              navigate(
                routers.STORES.REFUND_MANAGEMENT_DETAIL.replace(":storeId", `${currentStore?.id}`).replace(
                  ":id",
                  `${record?.id}`
                )
              )
            }
          >
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return (
          <>
            {record.status === TransactionsStatus.PENDING_REFUND.toString() && (
              <>
                <span className={styles.actionBtn} onClick={() => onClickDecline(record.id)}>
                  <RefundDeclineIcon />
                </span>
                <span className={styles.actionBtn} onClick={() => onClickResolve(record.id)}>
                  <RefundAcceptIcon />
                </span>
              </>
            )}

            {record.status === TransactionsStatus.REJECTED.toString() && (
              <>
                <span className={styles.actionBtnDecline}>
                  <RefundDeclineIcon />
                </span>
              </>
            )}

            {record.status === TransactionsStatus.REFUNDED.toString() && (
              <>
                <span className={styles.actionBtnAccept}>
                  <RefundAcceptedIcon />
                </span>
              </>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{`Refund Management`}</div>
        <div className={styles.filters}>
          <div className={styles.pagination}>
            <CustomPagination
              showSizeChanger
              current={page}
              onShowSizeChange={onShowSizeChange}
              onChange={(page, pageSize) => pageChange(page, pageSize)}
              defaultCurrent={1}
              total={total}
            />
          </div>
        </div>
      </div>

      <div className={styles.productPanel}>
        <CustomTable pagination={false} columns={columns} dataSource={data} scroll={{ y: "35vw" }} />
      </div>

      <ConfirmPopup
        open={openConfirmPopup === "RESOlVE" || openConfirmPopup === "DECLINE"}
        onCancel={() => {
          setOpenConfirmPopup("");
        }}
        title="Confirmation"
        description={`Are you sure you want to ${
          openConfirmPopup === "RESOlVE" ? "resolve" : "decline"
        } this refund request? `}
        onConfirm={() => {
          onConfirm(openConfirmPopup === "RESOlVE");
        }}
      />
    </div>
  );
};

export default RefundManagementComp;
