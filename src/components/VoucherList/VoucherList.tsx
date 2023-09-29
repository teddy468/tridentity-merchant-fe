import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomPagination from "../../commons/components/CustomPagination";
import CustomTable from "../../commons/components/CustomTable";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import { VOUCHER_MANAGEMENT } from "../../commons/constants/api-urls";
import { navigations } from "../../commons/constants/routers";
import { EditIcon, EyeBoldIcon } from "../../commons/resources";
import defaultAxios from "../../commons/utils/axios";
import { AppContext } from "../../contexts/AppContext";
import { VoucherStatus } from "../Form/CreateAndUpdateVoucher/CreateAndUpdateVoucher";
import { STATUS_CODE } from "../Notification/Notification";
import styles from "./VoucherList.module.scss";

const VoucherList: React.FC = () => {
  const { user } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
    merchant_store_id: storeId,
  });
  const [metadata, setMetadata] = useState<any>({
    "x-total-count": 0,
    "x-pages-count": 0,
  });
  const [data, setData] = useState([]);

  const merchantId = user?.merchantIds?.[0];

  useEffect(() => {
    if (merchantId) {
      getListVoucher();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId, params]);

  const getListVoucher = async () => {
    try {
      const res = await defaultAxios.get<any>(VOUCHER_MANAGEMENT(merchantId as number), { params });
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        setData(res.data?.data);
      }
      if (res.data.metadata && res.status === STATUS_CODE.SUCCESS) {
        setMetadata(res.data.metadata);
      }
    } catch (error) {}
  };

  const goToDetail = (item: any) => {
    navigate(navigations.STORES.VOUCHER_DETAIL(storeId as string, item?.id));
  };

  const goToList = () => {
    navigate(navigations.STORES.CREATE_VOUCHER(storeId as string));
  };

  const columns: ColumnsType<any> = [
    {
      title: "Voucher name",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <div onClick={() => goToDetail(record)} className={`${styles.product} ${styles.pointer}`}>
            {text}
          </div>
        );
      },
    },
    // {
    //   title: "Store",
    //   dataIndex: "store_name",
    //   render: (text, record) => {
    //     return (
    //       <div onClick={() => goToDetail(record)} className={`${styles.product} ${styles.pointer}`}>
    //         {record?.store?.name}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Supply",
      dataIndex: "supply",
      render: (text, record) => {
        return (
          <div onClick={() => goToDetail(record)} className={`${styles.product} ${styles.pointer}`}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Total claimed",
      dataIndex: "claimed",
      render: (text, record) => {
        return (
          <div onClick={() => goToDetail(record)} className={`${styles.product} ${styles.pointer}`}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Available Quantity",
      dataIndex: "available_quantity",
      render: (text, record) => {
        return (
          <div onClick={() => goToDetail(record)} className={`${styles.product} ${styles.pointer}`}>
            {record?.supply - record?.used}
          </div>
        );
      },
    },
    {
      title: "Total Used",
      dataIndex: "used",
      render: (text, record) => {
        return (
          <div onClick={() => goToDetail(record)} className={`${styles.product} ${styles.pointer}`}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Voucher Expense",
      dataIndex: "voucher_expense",
      render: (text, record) => {
        return (
          <div onClick={() => goToDetail(record)} className={`${styles.product} ${styles.pointer}`}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Valid date",
      dataIndex: "create_date",
      render: (text, record) => {
        return (
          <div onClick={() => goToDetail(record)} className={styles.pointer}>
            {`${dayjs(record?.start_date).isValid() && dayjs(record?.start_date).format("DD/MM/YYYY")}`} -
            {dayjs(record?.end_date).isValid() && dayjs(record?.end_date).format("DD/MM/YYYY")}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        let status;
        if (text === VoucherStatus.ACTIVE) {
          status = "Active";
        } else if (text === VoucherStatus.INACTIVE) {
          status = "Inactive";
        } else {
          status = "Draft";
        }
        return (
          <div
            onClick={() => goToDetail(record)}
            className={
              text === VoucherStatus.ACTIVE ? styles.active : text === VoucherStatus.INACTIVE ? styles.inactive : ""
            }
          >
            {status}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (text, record) => {
        let isDraft = text === VoucherStatus.DRAFT;
        return (
          <div className={styles.edit}>
            {isDraft ? (
              <EditIcon
                onClick={() => {
                  navigate(navigations.STORES.EDIT_VOUCHER(storeId as string, record?.id as string));
                }}
              />
            ) : (
              <EyeBoldIcon
                onClick={() => {
                  navigate(navigations.STORES.EDIT_VOUCHER(storeId as string, record?.id as string));
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const handleChangePagination = (page: number, pageSize: number) => {
    setParams({
      ...params,
      page,
      perPage: pageSize,
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>Voucher list</div>
        <PrimaryButton className={styles.addProductBtn} onClick={goToList}>
          Create new voucher
        </PrimaryButton>
      </div>
      <div className={styles.productPanel}>
        <div className={styles.paginationWrapper}>
          <CustomPagination
            current={params.page}
            showSizeChanger
            onChange={handleChangePagination}
            total={metadata["x-total-count"]}
          />
        </div>
        <CustomTable pagination={false} columns={columns} dataSource={data} scroll={{ y: "33vw" }} />
      </div>
    </div>
  );
};

export default VoucherList;
