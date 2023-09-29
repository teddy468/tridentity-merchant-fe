import { PaginationProps, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import CustomPagination from "../../commons/components/CustomPagination";
import CustomTable from "../../commons/components/CustomTable";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import {
  MERCHANT_SETTLEMENT_DETAIL_INVOLVE_STORE_URL,
  MERCHANT_SETTLEMENT_DETAIL_ORDER_EXPORT_URL,
  MERCHANT_SETTLEMENT_DETAIL_ORDER_URL,
  MERCHANT_SETTLEMENT_DETAIL_URL,
  MERCHANT_SETTLEMENT_GENERAL_INFO_URL,
  MERCHANT_SETTLEMENT_REQUEST_PAYMENT_CONFIRM_URL,
  MERCHANT_SETTLEMENT_REQUEST_PAYMENT_URL,
} from "../../commons/constants/api-urls";
import { getOrderStatus, getStatusColor } from "../../commons/constants/order";
import useFetch from "../../commons/hooks/useFetch";
import useFetchList from "../../commons/hooks/useFetchList";
import useToast from "../../commons/hooks/useToast";
import defaultAxios from "../../commons/utils/axios";
import { format2Digit, formatLP } from "../../commons/utils/functions/formatPrice";
import { AppContext } from "../../contexts/AppContext";
import { getStatusClass, getStatusMessageFiat, SettlementStatus } from "./index";
import styles from "./reconciliation.module.scss";
import { sortDate, sortDateInSecond, sortNumber } from "../../commons/utils/functions/sortData";

interface DataType {
  key: React.Key;
  id: number;
  actual_transaction_date?: string;
  last_transaction_date: string;
  expected_transaction_date: string;
  totalOrder: number;
  subTotal: number;
  platformFee: number;
  shippingFee: number;
  lpEarned: number;
  lpSpend: number;
  profit: number;
  status: { status: number };
}

interface DataTypeOrder {
  key: React.Key;
  no: number;
  orderId: number;
  date: string;
  compDate: string;
  storeId: number;
  store: string;
  platformFee: number;
  shippingFee: number;
  lpEarned: number;
  profit: number;
  status: number;
}

const ReconciliationDetail: React.FC = () => {
  const { user } = useContext(AppContext);
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const toast = useToast();
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [confirmPaymentReceived, setConfirmPaymentReceived] = useState(false);

  const { data: storeList } = useFetch<{ store_id: number; store_name: string }[]>(
    MERCHANT_SETTLEMENT_DETAIL_INVOLVE_STORE_URL(id ? id : "")
  );

  const storeOptions = useMemo(() => {
    const options = [{ value: "", label: "All store" }];
    if (storeList) {
      const stores = storeList.map(store => ({
        value: store.store_id.toString(),
        label: store.store_name,
      }));
      for (const store of stores) {
        options.push(store);
      }
    }
    return options;
  }, [storeList]);

  const [storeId, setStoreId] = useState<string | "">("");

  const handleChangeStore = (value: string) => {
    setStoreId(value);
    setPage(1);
  };

  const { data: product, refresh } = useFetch<SettlementItem>(MERCHANT_SETTLEMENT_DETAIL_URL(id ? id : -1));

  const param = {
    settlement_id: id,
    page: page,
    perPage: perPage,
    paginationMetadataStyle: "body",
    merchant_store_id: storeId ? Number(storeId) : "",
  };
  const { data: orders, total } = useFetchList<SettlementOrder>(
    MERCHANT_SETTLEMENT_DETAIL_ORDER_URL(user?.merchantIds ? user.merchantIds[0] : -1),
    param
  );

  const url = `${MERCHANT_SETTLEMENT_GENERAL_INFO_URL(
    user?.merchantIds ? user.merchantIds[0] : -1
  )}?settlement_id=${id}&merchant_store_id=${storeId}`;
  const { data: generalInfo } = useFetch<SettlementGeneralInfo>(url);

  const data: DataType[] = useMemo(() => {
    if (product) {
      const data: DataType = {
        key: product.id.toString(),
        actual_transaction_date: dayjs(product.actual_transaction_date).isValid()
          ? dayjs(product.actual_transaction_date).format("DD/MM/YYYY")
          : "",
        expected_transaction_date: moment(product.expected_transaction_date).format("DD/MM/yyyy"),
        last_transaction_date: moment(product.last_transaction_date).format("DD/MM/yyyy HH:mm"),
        id: product.id,
        status: { status: product.status },
        subTotal: product.amount_breakdown.ITEM_AMOUNT,
        lpEarned: product.amount_breakdown.LP_AMOUNT,
        lpSpend: product.amount_breakdown.LP_SPENT ? product.amount_breakdown.LP_SPENT : 0,
        platformFee: product.amount_breakdown.PLATFORM_FEE,
        shippingFee: product.amount_breakdown.DELIVERY_FEE,
        profit: product.amount_breakdown.NET_AMOUNT,
        totalOrder: product.amount_breakdown.TOTAL_ORDER,
      };
      return [data];
    }
    return [];
  }, [product]);

  const dataOrder: DataTypeOrder[] = useMemo(() => {
    return orders.map((product: SettlementOrder, index) => {
      const tran = product.transactions.length > 0 ? product.transactions[0] : undefined;
      const his = product.histories.length > 0 ? product.histories[0] : undefined;
      return {
        key: product.id.toString(),
        no: index + 1,
        id: product.id,
        orderId: product.id,
        date: moment(product.create_time).format("DD/MM/yyyy HH:mm"),
        compDate: his ? moment(his.create_time).format("DD/MM/yyyy HH:mm") : "",
        storeId: product.merchant_store_id,
        store: product.store.name,
        shippingFee: tran ? tran.amount_breakdown.delivery_fee : 0,
        lpEarned: tran ? tran.amount_breakdown.used_loyalty_point : 0,
        platformFee: tran ? tran.amount_breakdown.platform_fee : 0,
        profit: tran ? tran.amount_breakdown.net_amount : 0,
        status: product.status,
      };
    });
  }, [orders]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Total Orders",
      dataIndex: "totalOrder",
      render: (text, record) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Expected Settlement Date",
      dataIndex: "date",
      render: (_, record) => {
        return <div>{record.expected_transaction_date}</div>;
      },
    },
    {
      title: "Actual Settlement Date",
      dataIndex: "date",
      render: (_, record) => {
        return <div>{record.actual_transaction_date}</div>;
      },
    },
    // {
    //   title: "Subtotal",
    //   dataIndex: "subTotal",
    //   render: (text, record) => {
    //     return (
    //       <div>
    //         S$ {format2Digit(text)}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Platform fee",
      dataIndex: "platformFee",
      render: (text, record) => {
        return <div>S$ {format2Digit(text)}</div>;
      },
    },
    {
      title: "Shipping fee",
      dataIndex: "shippingFee",
      render: (text, record) => {
        return <div>S$ {format2Digit(text)}</div>;
      },
    },
    // {
    //   title: "LP spent",
    //   dataIndex: "lpSpend",
    //   render: (text, record) => {
    //     return (
    //       <div>
    //         {format2Digit(text)} LP
    //       </div>
    //     );
    //   },
    // },
    {
      title: "LP earned",
      dataIndex: "lpEarned",
      render: (text, record) => {
        return <div>{formatLP(text)}</div>;
      },
    },
    {
      title: "Receivable Amount",
      dataIndex: "profit",
      render: (text, record) => {
        return <div>S$ {format2Digit(text)}</div>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <div>
            <span className={getStatusClass(record.status.status)}>{getStatusMessageFiat(record.status.status)}</span>
          </div>
        );
      },
    },
  ];

  const columnsOrders: ColumnsType<DataTypeOrder> = [
    {
      title: "No",
      dataIndex: "no",
      render: (_, record) => {
        return <div className={styles.productName}>{record.no}</div>;
      },
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      render: (text, record) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Transaction D&T",
      dataIndex: "date",
      render: (text, record) => {
        return <div>{text}</div>;
      },
      sorter: (a, b) => sortDateInSecond(a.date, b.date),
    },
    {
      title: "Comp. D&T",
      dataIndex: "compDate",
      render: (text, record) => {
        return <div>{text}</div>;
      },
      sorter: (a, b) => sortDateInSecond(a.compDate, b.compDate),
    },
    {
      title: "Store name",
      dataIndex: "store",
      render: (text, record) => {
        return <div>{text}</div>;
      },
      filters: storeList?.map(store => ({ text: store.store_name, value: store.store_name })),
      onFilter: (value, record) => {
        return record.store === value;
      },
    },
    {
      title: "Store ID",
      dataIndex: "storeId",
      render: (text, record) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Shipping fee",
      dataIndex: "shippingFee",
      render: (text, record) => {
        return <div className={styles.pointer}>S$ {format2Digit(text)}</div>;
      },
      sorter: (a, b) => sortNumber(a.shippingFee, b.shippingFee),
    },
    {
      title: "Platform fee",
      dataIndex: "platformFee",
      render: (text, record) => {
        return <div className={styles.pointer}>S$ {format2Digit(text)}</div>;
      },
      sorter: (a, b) => sortNumber(a.platformFee, b.platformFee),
    },
    {
      title: "LP Earned",
      dataIndex: "lpEarned",
      render: (text, record) => {
        return <div className={styles.pointer}>{formatLP(text)}</div>;
      },
      sorter: (a, b) => sortNumber(a.lpEarned, b.lpEarned),
    },
    {
      title: "Receivable Amount",
      dataIndex: "profit",
      render: (text, record) => {
        return <div className={styles.pointer}>S$ {format2Digit(text)}</div>;
      },
      sorter: (a, b) => sortNumber(a.profit, b.profit),
    },
    {
      title: "Order Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <div className={styles.pointer}>
            <span style={{ color: `${getStatusColor(record.status)}` }}>{getOrderStatus(record.status)}</span>
          </div>
        );
      },
      filters: [
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
      ],
    },
  ];

  const clickExportCsv = async () => {
    const FileDownload = require("js-file-download");
    const url = `${MERCHANT_SETTLEMENT_DETAIL_ORDER_EXPORT_URL(
      user?.merchantIds ? user.merchantIds[0] : -1
    )}?settlement_id=${id}&merchant_store_id=${storeId}`;
    defaultAxios.get(url, { responseType: "blob" }).then(response => {
      FileDownload(response.data, "order.csv");
    });
  };

  const clickRequestFIATPayment = async () => {
    try {
      await defaultAxios.put(MERCHANT_SETTLEMENT_REQUEST_PAYMENT_URL, { settlementIds: [Number(id)] });
      toast.success("Request success");
      setConfirmPayment(false);
      refresh();
    } catch (err) {
      const error = (err as AxiosError<any>)?.response?.data;
      const message =
        typeof error?.error.message === "string"
          ? error?.error.message
          : typeof error?.error.message?.[0] === "string"
          ? error.error.message[0]
          : "Request Fail";
      toast.error(message);
      return "";
    }
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
    setPerPage(pageSize);
    setPage(current);
  };

  const clickRequestFIATPaymentReceived = async () => {
    try {
      await defaultAxios.post(MERCHANT_SETTLEMENT_REQUEST_PAYMENT_CONFIRM_URL, { settlementIds: [Number(id)] });
      toast.success("Request success");
      setConfirmPaymentReceived(false);
      refresh();
    } catch (err) {
      const error = (err as AxiosError<any>)?.response?.data;
      const message =
        typeof error?.error.message === "string"
          ? error?.error.message
          : typeof error?.error.message?.[0] === "string"
          ? error.error.message[0]
          : "Request Fail";
      toast.error(message);
      return "";
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{moment(product?.create_time).format("DD/MM/yyyy")}</div>

        {/*{product?.status !== SettlementStatus.PROCESSING && <PrimaryButton*/}
        {/*  disabled={disableBtnPayment}*/}
        {/*  className={`${styles.addProductBtn} ${disableBtnPayment ? styles.btnDisable : ""}`}*/}
        {/*  onClick={() => setConfirmPayment(true)}*/}
        {/*>*/}
        {/*  Request Payment*/}
        {/*</PrimaryButton>}*/}

        {product?.status === SettlementStatus.PROCESSING && (
          <PrimaryButton className={styles.addProductBtn} onClick={() => setConfirmPaymentReceived(true)}>
            Payment Received
          </PrimaryButton>
        )}
      </div>

      <div className={styles.productPanel}>
        <div className={styles.tabContent}>
          <CustomTable pagination={false} columns={columns} dataSource={data} />
        </div>
      </div>

      <div className={styles.filterReconciliation}>
        <div className={styles.left}>
          <p>Fillter by Store ID</p>
          <Select
            defaultValue=""
            className="select-reconciliation"
            style={{ width: 120 }}
            onChange={handleChangeStore}
            options={storeOptions}
          />
        </div>
        <PrimaryButton className={styles.addProductBtn} onClick={() => clickExportCsv()}>
          Export CSV
        </PrimaryButton>
      </div>

      <div className={styles.productPanel}>
        <div className={styles.tabContent}>
          <CustomTable pagination={false} columns={columnsOrders} dataSource={dataOrder} scroll={{ x: true }} />
        </div>
      </div>
      {total > 10 && (
        <div className={styles.paginationWrapper}>
          <CustomPagination
            defaultCurrent={page}
            onChange={page => setPage(page)}
            showSizeChanger
            total={total}
            onShowSizeChange={onShowSizeChange}
          />
        </div>
      )}

      <div className={styles.reconciliationInfor}>
        <div className={styles.cover} style={{ height: "70px" }}>
          <div className={`${styles.item} ${styles.bgDark}`} style={{ opacity: 0 }}>
            ""
          </div>
          <div className={`${styles.item} ${styles.bgDark}`}>Platform fee</div>
          <div className={`${styles.item} ${styles.bgDark}`}>Shipping fee</div>
          <div className={`${styles.item} ${styles.bgDark}`}>LP earned</div>
          <div className={`${styles.item} ${styles.bgDark}`}>Receivables</div>
        </div>
        <div className={styles.cover}>
          <div className={styles.item}>TOTAL</div>
          <div className={styles.item}>S$ {format2Digit(Number(generalInfo?.platform_fee))}</div>
          <div className={styles.item}>S$ {format2Digit(Number(generalInfo?.delivery_fee))}</div>
          <div className={styles.item}>{formatLP(Number(generalInfo?.used_loyalty_point))} LP</div>
          <div className={styles.item}>S$ {format2Digit(Number(generalInfo?.net_amount))}</div>
        </div>
      </div>

      <ConfirmPopup
        open={confirmPayment}
        onCancel={() => setConfirmPayment(false)}
        title="Request Payment"
        description={`Are you sure you want to proceed with the request?`}
        onConfirm={clickRequestFIATPayment}
      />

      <ConfirmPopup
        open={confirmPaymentReceived}
        onCancel={() => setConfirmPaymentReceived(false)}
        title="Payment Received"
        description={`Are you sure you want to confirm?`}
        onConfirm={clickRequestFIATPaymentReceived}
      />
    </div>
  );
};

export default ReconciliationDetail;
