import { DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CustomTable from "../../commons/components/CustomTable";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import { getOrderStatus } from "../../commons/constants/order";
import { format2Digit, formatLP, formatRoundFloorDisplay } from "../../commons/utils/functions/formatPrice";
import { AppContext } from "../../contexts/AppContext";
import "./index.scss";
import styles from "./product-management.module.scss";
import CustomPagination from "../../commons/components/CustomPagination";

var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

interface IOrderListInReportComp {
  data: ReportOrderList[];
  onFilter: (start_date: string, end_date: string) => void;
  onExportToCsv: () => void;
  page: number;
  total: number;
  handleChangePagination: (pageNumber: number, pageSize: number) => void;
}

const OrderListInReportComp: React.FC<IOrderListInReportComp> = (props: IOrderListInReportComp) => {
  const { data, onFilter, onExportToCsv, page, total, handleChangePagination } = props;
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();

  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);
  const dataTotal = useMemo(() => {
    if (data.length === 0) return { platformFee: 0, lpEarn: 0, receivables: 0 };
    const total = { platformFee: 0, lpEarn: 0, receivables: 0 };
    data.forEach(item => {
      total.platformFee = total.platformFee + item.platform_fee;
      total.lpEarn = total.lpEarn + item.used_loyalty_point;
      total.receivables = total.receivables + item.net_amount;
    });
    return total;
  }, [data]);
  const columns: ColumnsType<any> = [
    {
      title: "Order ID",
      dataIndex: "id",
      render: (text, record) => {
        return (
          <div className="pointer" onClick={() => {}}>
            {text}
          </div>
        );
      },
    },

    {
      title: "Date",
      key: "order_date",
      width: 170,
      render: (text, record) => {
        return (
          <div className="pointer" onClick={() => {}}>
            {record?.order_date}
          </div>
        );
      },
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      render: (text, record) => {
        return (
          <div className="pointer" onClick={() => {}}>
            S$ {format2Digit(text)}
          </div>
        );
      },
    },
    {
      title: "Platform fee",
      dataIndex: "platform_fee",
      render: (text, record) => {
        return (
          <div className="pointer" onClick={() => {}}>
            S$ {format2Digit(text)}
          </div>
        );
      },
    },
    {
      title: "Shipping fee",
      dataIndex: "delivery_fee",
      render: (text, record) => {
        return (
          <div className="pointer" onClick={() => {}}>
            S$ {format2Digit(text)}
          </div>
        );
      },
    },
    {
      title: "Discount",
      dataIndex: "discount_amount",
      render: (text, record) => {
        return (
          <div className="pointer" onClick={() => {}}>
            S$ {format2Digit(text)}
          </div>
        );
      },
    },
    {
      title: "LP earned",
      dataIndex: "used_loyalty_point",
      render: (text, record) => {
        return (
          <div className="pointer" onClick={() => {}}>
            + {formatLP(text)} LP
          </div>
        );
      },
    },
    // {
    //   title: "Profit",
    //   dataIndex: "net_amount",
    //   render: (text, record) => {
    //     return (
    //       <div className="pointer" onClick={() => {}}> temporary comment
    //         S$ {format2Digit(text)}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <div
            className="pointer"
            style={text === "Await" ? { color: "#F79009" } : { color: "#12B76A" }}
            onClick={() => {}}
          >
            {getOrderStatus(text)}
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{`Order list`}</div>
        <div className={`${styles.filters} filters`}>
          <div>Filter by month</div>
          <DatePicker
            picker="month"
            popupClassName="picker"
            placeholder={"Select Month"}
            defaultValue={dayjs()}
            onChange={value =>
              onFilter(value?.startOf("month").utc().format() as string, value?.endOf("month").utc().format() as string)
            }
          />
          <PrimaryButton disabled={data.length === 0} className={styles.addProductBtn} onClick={onExportToCsv}>
            Export to CSV
          </PrimaryButton>
        </div>
      </div>
      <div className={styles.productPanel}>
        <CustomTable pagination={false} columns={columns} dataSource={data} />
        <div className={styles.paginationBox}>
          <CustomPagination
            defaultCurrent={1}
            current={page}
            showSizeChanger
            onChange={handleChangePagination}
            total={total}
          />
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.reconciliationInfor}>
          <div className={styles.cover} style={{ height: "70px" }}>
            <div className={`${styles.item} ${styles.bgDark}`} style={{ opacity: 0 }}>
              ""
            </div>
            <div className={`${styles.item} ${styles.bgDark}`}>Platform fee</div>
            <div className={`${styles.item} ${styles.bgDark}`}>LP earned</div>
            <div className={`${styles.item} ${styles.bgDark}`}>Receivables</div>
          </div>
          <div className={styles.cover}>
            <div className={styles.item}>TOTAL</div>
            <div className={styles.item}>S${format2Digit(dataTotal.platformFee)} </div>
            <div className={styles.item}>${format2Digit(dataTotal.lpEarn)} LP</div>
            <div className={styles.item}>S${format2Digit(dataTotal.receivables)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderListInReportComp;
