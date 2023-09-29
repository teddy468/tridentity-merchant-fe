import type { MenuProps } from "antd";
import { Button, DatePicker, Dropdown, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import {
  MERCHANT_SETTLEMENT_REQUEST_PAYMENT_CONFIRM_URL,
  MERCHANT_SETTLEMENT_URL,
} from "../../commons/constants/api-urls";
import { navigations } from "../../commons/constants/routers";
import useFetchList from "../../commons/hooks/useFetchList";
import { AppContext } from "../../contexts/AppContext";
import styles from "./reconciliation.module.scss";
import useToast from "../../commons/hooks/useToast";
import dayjs from "dayjs";
import CustomTable from "../../commons/components/CustomTable";
import { CalendarOutlined, DownOutlined } from "@ant-design/icons";
import moment from "moment";
import { AxiosError } from "axios";
import defaultAxios from "../../commons/utils/axios";
import { format2Digit, formatLP } from "../../commons/utils/functions/formatPrice";
import { sortDate, sortNumber, sortString } from "../../commons/utils/functions/sortData";

const { RangePicker } = DatePicker;

interface DataType {
  key: React.Key;
  id: number;
  actual_transaction_date?: string;
  last_transaction_date: string;
  expected_transaction_date: string;
  subTotal: number;
  totalOrder: number;
  platformFee: number;
  shippingFee: number;
  lpEarned: number;
  lpSpend: number;
  profit: number;
  status: { status: number };
}

export enum SettlementStatus {
  CREATED = 0,
  REQUESTED = 1,
  PROCESSING = 2,
  PAID = 3,
}

export const statusMessages: Record<number, string[]> = {
  [SettlementStatus.CREATED]: ["Created", "LP Cash out Created"],
  [SettlementStatus.REQUESTED]: ["Requested", "LP Cash out Requested"],
  [SettlementStatus.PROCESSING]: ["Processing", "LP Cash out Processing"],
  [SettlementStatus.PAID]: ["Paid", "LP Cash out"],
};

export function getStatusMessageFiat(status: number): string {
  return statusMessages[status][0] || "Invalid status";
}

export function getStatusClass(status: number): any {
  if (status === SettlementStatus.CREATED) {
    return styles.createdStatus;
  } else if (status === SettlementStatus.PROCESSING) {
    return styles.processingStatus;
  } else if (status === SettlementStatus.REQUESTED) {
    return styles.requestedStatus;
  } else {
    return styles.paidStatus;
  }
}

const items = [
  {
    label: "All Status",
    key: "-1",
  },
  {
    label: "Created",
    key: "0",
  },
  {
    label: "Processing",
    key: "2",
  },
  {
    label: "Paid",
    key: "3",
  },
];

const Reconciliation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const toast = useToast();
  const [confirmPayment, setConfirmPayment] = useState(false);

  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));

  const [disableBtn, setDisableBtn] = useState(true);
  const [selectedId, setSelectedId] = useState<number[]>([]);

  const dateChange = (values: any, dateStrings: [string, string]) => {
    if (values && values.length >= 2) {
      setStartDate(values[0]);
      setEndDate(values[1]);
    }
  };

  const [status, setStatus] = useState<number>(-1);
  const [statusLabel, setStatusLabel] = useState("All Status");

  const handleMenuClick: MenuProps["onClick"] = e => {
    const key = e.key;
    const selectStatus = items.find(item => item && item.key === key);
    if (selectStatus) {
      console.log(selectStatus);
      setStatus(Number(selectStatus.key));
      setStatusLabel(selectStatus.label);
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const params = {
    start_date: startDate.toISOString(),
    end_date: endDate.add(1, "day").toISOString(),
    status: status !== -1 ? status : "",
  };

  const { data: products, refresh } = useFetchList<SettlementItem>(
    MERCHANT_SETTLEMENT_URL(user?.merchantIds ? user.merchantIds[0] : -1),
    params as any
  );

  const data: DataType[] = useMemo(() => {
    return products.map((product: SettlementItem) => {
      return {
        key: product.id.toString(),
        actual_transaction_date: dayjs(product.actual_transaction_date).isValid()
          ? dayjs(product.actual_transaction_date).format("DD/MM/YYYY")
          : "",
        expected_transaction_date: moment(product.expected_transaction_date).format("DD/MM/yyyy"),
        last_transaction_date: moment(product.last_transaction_date).format("DD/MM/yyyy"),
        id: product.id,
        subTotal: product.amount_breakdown.ITEM_AMOUNT,
        status: { status: product.status },
        lpEarned: product.amount_breakdown.LP_AMOUNT,
        lpSpend: product.amount_breakdown.LP_SPENT ? product.amount_breakdown.LP_SPENT : 0,
        platformFee: product.amount_breakdown.PLATFORM_FEE,
        shippingFee: product.amount_breakdown.DELIVERY_FEE,
        profit: product.amount_breakdown.NET_AMOUNT,
        totalOrder: product.amount_breakdown.TOTAL_ORDER,
      };
    });
  }, [products]);

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedId(selectedRows.map(value => value.id));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,

    getCheckboxProps: (record: DataType) => ({
      disabled: record.status.status !== SettlementStatus.PROCESSING,
      name: record.id.toString(),
    }),
  };

  useEffect(() => {
    if (selectedId && selectedId.length > 0) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [selectedId, setSelectedId.length]);

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "no",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Transaction Date",
      dataIndex: "last_transaction_date",
      key: "last_transaction_date",
      render: (_, record) => {
        return (
          <div onClick={() => navigate(navigations.RECONCILIATION_DETAIL(record.id))} className={styles.pointer}>
            {record.last_transaction_date}
          </div>
        );
      },
      sorter: (a, b) => sortDate(a.last_transaction_date, b.last_transaction_date),
    },
    {
      title: "Expected \n" + "Settlement Date",
      dataIndex: "expected_transaction_date",
      render: (_, record) => {
        return (
          <div onClick={() => navigate(navigations.RECONCILIATION_DETAIL(record.id))} className={styles.pointer}>
            {record.expected_transaction_date}
          </div>
        );
      },
      sorter: (a, b) => sortDate(a.expected_transaction_date, b.expected_transaction_date),
    },
    {
      title: "Actual \n" + "Settlement Date",
      dataIndex: "actual_transaction_date",
      render: (_, record) => {
        return (
          <div onClick={() => navigate(navigations.RECONCILIATION_DETAIL(record.id))} className={styles.pointer}>
            {record.actual_transaction_date}
          </div>
        );
      },
      sorter: (a, b) => {
        if (!a.actual_transaction_date) return 1;
        if (!b.actual_transaction_date) return -1;
        return sortDate(a.actual_transaction_date, b.actual_transaction_date);
      },
    },
    {
      title: "Total Orders",
      dataIndex: "totalOrder",
      render: (_, record) => {
        return (
          <div onClick={() => navigate(navigations.RECONCILIATION_DETAIL(record.id))} className={styles.pointer}>
            {record.totalOrder}
          </div>
        );
      },
      sorter: (a, b) => sortNumber(a.totalOrder, b.totalOrder),
    },
    {
      title: "Total",
      dataIndex: "subTotal",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(navigations.RECONCILIATION_DETAIL(record.id))} className={styles.pointer}>
            S$ {format2Digit(text)}
          </div>
        );
      },
      sorter: (a, b) => sortNumber(a.subTotal, b.subTotal),
    },
    {
      title: "Platform fee",
      dataIndex: "platformFee",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(navigations.RECONCILIATION_DETAIL(record.id))} className={styles.pointer}>
            S$ {format2Digit(text)}
          </div>
        );
      },
      sorter: (a, b) => sortNumber(a.platformFee, b.platformFee),
    },
    {
      title: "Shipping fee",
      dataIndex: "shippingFee",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(navigations.RECONCILIATION_DETAIL(record.id))} className={styles.pointer}>
            S$ {format2Digit(text)}
          </div>
        );
      },
      sorter: (a, b) => sortNumber(a.shippingFee, b.shippingFee),
    },
    {
      title: "LP Earned",
      dataIndex: "lpEarned",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(navigations.RECONCILIATION_DETAIL(record.id))} className={styles.pointer}>
            {formatLP(text)}
          </div>
        );
      },
      sorter: (a, b) => sortNumber(a.lpEarned, b.lpEarned),
    },
    {
      title: "Receivables",
      dataIndex: "profit",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(navigations.RECONCILIATION_DETAIL(record.id))} className={styles.pointer}>
            S$ {format2Digit(text)}
          </div>
        );
      },
      sorter: (a, b) => sortNumber(a.profit, b.profit),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(navigations.RECONCILIATION_DETAIL(record.id))} className={styles.pointer}>
            <span className={getStatusClass(record.status.status)}>{getStatusMessageFiat(record.status.status)}</span>
          </div>
        );
      },
      sorter: (a, b) => sortNumber(a.status.status, b.status.status),
    },
  ];

  const clickPaymentReceived = async () => {
    if (!selectedId || selectedId.length === 0) {
      return;
    }
    try {
      await defaultAxios.post(MERCHANT_SETTLEMENT_REQUEST_PAYMENT_CONFIRM_URL, { settlementIds: selectedId });
      toast.success("Request success");
      setSelectedRowKeys([]);
      setSelectedId([]);
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>Settlement report</div>

        <Space direction="vertical" size={12} className={styles.datePicker}>
          <RangePicker format={"DD/MM/YYYY"} onChange={dateChange} defaultValue={[startDate, endDate]} />
        </Space>

        <PrimaryButton
          disabled={disableBtn}
          className={`${styles.addProductBtn} ${disableBtn ? styles.btnDisable : ""}`}
          onClick={() => setConfirmPayment(true)}
        >
          Payment Received
        </PrimaryButton>
      </div>

      <div className={styles.statusWrapper}>
        <div className={styles.status}>Status</div>
        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              {statusLabel} <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </div>

      <div className={styles.productPanel}>
        <div className={styles.tabContent}>
          <CustomTable
            pagination={false}
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
            scroll={{ x: true }}
          />
        </div>
      </div>
      <ConfirmPopup
        open={confirmPayment}
        onCancel={() => setConfirmPayment(false)}
        title="Payment Received"
        description={`Are you sure you want to confirm?`}
        onConfirm={clickPaymentReceived}
      />
    </div>
  );
};

export default Reconciliation;
