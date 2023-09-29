import { DatePicker, DatePickerProps, Pagination, PaginationProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomTable from "../../commons/components/CustomTable";
import { navigations } from "../../commons/constants/routers";
import { AppContext } from "../../contexts/AppContext";
import "./index.scss";
import styles from "./product-management.module.scss";
import { ArrowLeftIcon, ArrowRightIcon } from "../../assets/icons";
import useFetchList from "../../commons/hooks/useFetchList";
import { RATE_URL } from "../../commons/constants/api-urls";
import moment from "moment";
import { DownOutlined } from "@ant-design/icons";
import CustomPagination from "../../commons/components/CustomPagination";

interface DataType {
  id: number;
  customerInfo: string;
  rating: string;
  description: string;
  images: string[];
  date: string;
}

const RatingManagementComp: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [dateRange, setDateRange] = useState<string[]>([]);
  const param = {
    page: page,
    perPage: perPage,
    paginationMetadataStyle: "body",
    sort_by: "create_time",
    order_by: "DESC",
    start_date: dateRange[0],
    end_date: dateRange[1],
  };

  const { setCurrentStore, store, currentStore } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const { data: dataRate, total } = useFetchList<Rate>(currentStore ? RATE_URL(currentStore.id) : "", param);

  const data: DataType[] = useMemo(() => {
    if (dataRate) {
      return dataRate.map((value, index) => {
        return {
          id: value.id,
          customerInfo: value.order.user.full_name,
          rating: value.rating.toString() + "/5",
          date: value.create_time ? moment(value.create_time).format("DD/MM/yyyy HH:mm:ss") : "",
          images: value.data.attachments,
          description: value.description,
        };
      });
    }
    return [];
  }, [dataRate]);

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
    setPage(current);
    setPerPage(pageSize);
  };

  const handleChange: DatePickerProps["onChange"] = value => {
    if (value) {
      const startTime = value.startOf("month").toISOString();
      const endTime = value.endOf("month").toISOString();
      setDateRange([startTime, endTime]);
    } else setDateRange([]);
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Consumer",
      dataIndex: "customerInfo",
      render: (text, record) => {
        console.log({ text, record });
        return (
          <div
            className="pointer"
            onClick={() =>
              navigate(navigations.STORES.RATE_MANAGEMENT_DETAIL(currentStore ? currentStore.id : "", `${record.id}`))
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (text, record) => {
        return (
          <div
            className="pointer"
            onClick={() =>
              navigate(navigations.STORES.RATE_MANAGEMENT_DETAIL(currentStore ? currentStore.id : "", `${record.id}`))
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Feedback",
      dataIndex: "description",
      render: (text, record) => {
        return (
          <div
            className="pointer"
            onClick={() =>
              navigate(navigations.STORES.RATE_MANAGEMENT_DETAIL(currentStore ? currentStore.id : "", `${record.id}`))
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Image",
      dataIndex: "images",
      width: 240,
      render: (images: string[], record) => {
        return (
          <div className={styles.images}>
            {images.map((value, index) => {
              return <img src={value} alt="img" key={index} />;
            })}
          </div>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        return (
          <div
            className="pointer"
            onClick={() =>
              navigate(navigations.STORES.RATE_MANAGEMENT_DETAIL(currentStore ? currentStore.id : "", `${record.id}`))
            }
          >
            {text}
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{`Rating management`}</div>
        <div className={`${styles.filters} filters`}>
          Filter by month
          <DatePicker
            className={styles.monthPicker}
            format="MM/YYYY"
            picker="month"
            suffixIcon={<DownOutlined size={16} color="#FFF" />}
            onChange={handleChange}
            placeholder="MM/YYYY"
          />
        </div>
      </div>

      <div className={styles.productPanel}>
        <CustomTable pagination={false} columns={columns} dataSource={data} scroll={{ y: "35vw" }} />
      </div>
      <div className={styles.pagination}>
        <CustomPagination
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          onChange={(page, pageSize) => pageChange(page, pageSize)}
          defaultCurrent={page}
          total={total}
        />
      </div>
    </div>
  );
};

export default RatingManagementComp;
