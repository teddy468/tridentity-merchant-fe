import { Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import CustomPagination from "../../commons/components/CustomPagination";
import CustomTable from "../../commons/components/CustomTable";
import { VOUCHER_DETAIL, VOUCHER_ODERS } from "../../commons/constants/api-urls";
import { getOrderStatus } from "../../commons/constants/order";
import { navigations } from "../../commons/constants/routers";
import { EditIcon, EyeBoldIcon } from "../../commons/resources";
import defaultAxios from "../../commons/utils/axios";
import { format2Digit } from "../../commons/utils/functions/formatPrice";
import { AppContext } from "../../contexts/AppContext";
import { VoucherStatus } from "../Form/CreateAndUpdateVoucher/CreateAndUpdateVoucher";
import { STATUS_CODE } from "../Notification/Notification";
import styles from "./VoucherDetail.module.scss";

const VoucherDetail: React.FC = () => {
  const { currentStore } = useContext(AppContext);
  const navigate = useNavigate();

  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [openConfirmPopupDeactivate, setOpenConfirmPopupDeactivate] = useState(false);

  const { voucherId, storeId } = useParams();
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
  });
  const [metadata, setMetadata] = useState<any>({
    "x-total-count": 0,
    "x-pages-count": 0,
  });
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState<any>();

  useEffect(() => {
    if (Number(voucherId) > 0) {
      getListOrderUsedVoucher();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucherId, params]);

  useEffect(() => {
    if (Number(voucherId) > 0) {
      getVoucherDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucherId]);

  const getListOrderUsedVoucher = async () => {
    try {
      const res = await defaultAxios.get(VOUCHER_ODERS(voucherId as string), { params });
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        setData(res.data?.data);
      }
      if (res.data.metadata && res.status === STATUS_CODE.SUCCESS) {
        setMetadata(res.data.metadata);
      }
    } catch (error) {}
  };

  const getVoucherDetail = async () => {
    try {
      const res = await defaultAxios.get(VOUCHER_DETAIL(voucherId as string));
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setDetail(res.data);
      }
    } catch (error) {}
  };

  const goToEdit = () => {
    navigate(navigations.STORES.EDIT_VOUCHER(storeId as string, voucherId as string));
  };

  const columns: ColumnsType<any> = [
    {
      title: "Voucher name",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <div onClick={goToEdit} className={`${styles.product} ${styles.pointer}`}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Store",
      dataIndex: "merchant_store_id",
      render: (text, record) => {
        return (
          <div onClick={goToEdit} className={`${styles.product} ${styles.pointer}`}>
            {currentStore?.name}
          </div>
        );
      },
    },
    {
      title: "Supply",
      dataIndex: "supply",
      render: (text, record) => {
        return (
          <div onClick={goToEdit} className={`${styles.product} ${styles.pointer}`}>
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
          <div onClick={goToEdit} className={`${styles.product} ${styles.pointer}`}>
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
          <div onClick={goToEdit} className={`${styles.product} ${styles.pointer}`}>
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
          <div onClick={goToEdit} className={`${styles.product} ${styles.pointer}`}>
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
          <div onClick={goToEdit} className={`${styles.product} ${styles.pointer}`}>
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
          <div className={styles.pointer} onClick={goToEdit}>
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
            onClick={goToEdit}
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
                  navigate(navigations.STORES.EDIT_VOUCHER(storeId as string, voucherId as string));
                }}
              />
            ) : (
              <EyeBoldIcon
                onClick={() => {
                  navigate(navigations.STORES.EDIT_VOUCHER(storeId as string, voucherId as string));
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const columnOrder: ColumnsType<any> = [
    {
      title: "Order ID",
      dataIndex: "id",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
    },
    {
      title: "Delivery address",
      dataIndex: "address",
    },
    {
      title: "Status",
      dataIndex: "status",
      render : (text) => getOrderStatus(Number(text))
    },
    {
      title: "Amount",
      dataIndex: "subtotal",
      render: text => format2Digit(text),
    },
    {
      title: "Voucher used",
      dataIndex: "total_used_voucher",
    },
    {
      title: "Voucher Expense",
      dataIndex: "voucher_expense",
      render: text => format2Digit(text),
    },
    {
      title: "Time",
      dataIndex: "order_date",
      render: text => dayjs(text).isValid() && dayjs(text).format("DD/MM/YYYY , HH:mm"),
    },
  ];

  const handleChangePagination = (page: number, pageSize: number) => {
    setParams({
      ...params,
      page,
      perPage: pageSize,
    });
  };

  const reload = async () => {
    await Promise.all([getVoucherDetail(), getListOrderUsedVoucher()]);
  };

  const handleActivate = async () => {
    try {
      setOpenConfirmPopup(false);
      const body = {
        ...detail,
        status: VoucherStatus.ACTIVE,
      };
      await defaultAxios.put(VOUCHER_DETAIL(voucherId as string), body);
      await reload();
      message.success("Activate voucher successfuly!");
    } catch (error) {
      message.error(`Activate voucher fail!`);
    }
  };

  const handleDeactivate = async () => {
    try {
      setOpenConfirmPopupDeactivate(false);
      const body = {
        ...detail,
        status: VoucherStatus.INACTIVE,
      };
      await defaultAxios.put(VOUCHER_DETAIL(voucherId as string), body);
      await reload();
      message.success("Deactivate voucher successfuly!");
    } catch (error) {
      message.error(`Deactivate voucher fail!`);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{detail?.name}</div>
      </div>
      <CustomTable pagination={false} columns={columns} dataSource={[detail]} />
      <div className={styles.productPanel}>
        <div className={styles.paginationWrapper}>
          <CustomPagination
            current={params.page}
            showSizeChanger
            onChange={handleChangePagination}
            total={metadata["x-total-count"]}
          />
        </div>
        <CustomTable pagination={false} columns={columnOrder} dataSource={data} />
      </div>
      <div className={styles.action}>
        <Button
          type="default"
          disabled={Number(detail?.status) === VoucherStatus.INACTIVE}
          className={styles.draft}
          onClick={() => setOpenConfirmPopupDeactivate(true)}
        >
          Deactivate Voucher
        </Button>
        <Button
          type="primary"
          className={styles.save}
          onClick={() => setOpenConfirmPopup(true)}
          disabled={Number(detail?.status) === VoucherStatus.ACTIVE}
        >
          Activate Voucher
        </Button>
      </div>
      <ConfirmPopup
        open={openConfirmPopup}
        onCancel={() => setOpenConfirmPopup(false)}
        title="Confirmation"
        description={`Are you want to Activate this voucher ?`}
        onConfirm={handleActivate}
      />
      <ConfirmPopup
        open={openConfirmPopupDeactivate}
        onCancel={() => setOpenConfirmPopupDeactivate(false)}
        title="Confirmation"
        description={`Are you want to Deactivate this voucher ?`}
        onConfirm={handleDeactivate}
      />
    </div>
  );
};

export default VoucherDetail;
