import { PaginationProps, Tooltip } from "antd";
import { trim } from "lodash";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import GradientText from "../../commons/components/GradientText/GradientText";
import { SearchInput } from "../../commons/components/SearchInput";
import { ORDER_TRACKING_CONFIRM_URL, ORDER_TRACKING_URL } from "../../commons/constants/api-urls";
import { ORDER_STATUS } from "../../commons/constants/order";
import { navigations } from "../../commons/constants/routers";
import useFetchList from "../../commons/hooks/useFetchList";
import useToast from "../../commons/hooks/useToast";
import { NoteIcon } from "../../commons/resources";
import defaultAxios from "../../commons/utils/axios";
import { format2Digit } from "../../commons/utils/functions/formatPrice";
import { AppContext } from "../../contexts/AppContext";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import CustomTable from "../../commons/components/CustomTable";
import CustomPagination from "../../commons/components/CustomPagination";
import moment from "moment";
import { ColumnsType } from "antd/es/table";
declare interface Order {
  id: string;
  name: string;
  note: string;
  address: string;
  phone: string;
  originalStatus: number;
  status: string;
  statusClass: string;
  items: OrderItem[];
  payment: Payment;
  create_time: string;
  profit: number;
}

export const COMPLETED = "Completed";
export const ON_GOING = "On going";
export const CANCELLED = "Cancelled";

export enum OrderStatusEnum {
  PENDING = 0,
  CONFIRMED = 1,
  DELIVERING = 2,
  DELIVERED = 3,
  CANCELLED = 4,
  REFUNDING = 5,
  REFUNDED = 6,
  SUCCEEDED = 7,
  SETTLED = 8,
  WAITING_FOR_PAYMENT = 9,
  REJECTED = 10,
  EXPIRED = 11,
  ON_GOING = 12,
  COMPLETED = 13,
  USER_PICKED_UP = 14,
  PREPARED = 15,
  PAID = 16,
  REFUND_REJECTED = 17,
  PREPARING = 18,
}

export const getOrderStatus = (status: number) => {
  if (status === ORDER_STATUS.PENDING) {
    return "Pending";
  } else if (status === ORDER_STATUS.CONFIRMED) {
    return "Confirmed";
  } else if (status === ORDER_STATUS.DELIVERING) {
    return "Delivering";
  } else if (status === ORDER_STATUS.DELIVERED) {
    return "Delivered";
  } else if (status === ORDER_STATUS.CANCELLED) {
    return "Cancelled";
  } else if (status === ORDER_STATUS.REFUNDING) {
    return "Refunding";
  } else if (status === ORDER_STATUS.REFUNDED) {
    return "Refunded";
  } else if (status === ORDER_STATUS.SUCCEEDED) {
    return "Succeeded";
  } else if (status === ORDER_STATUS.SETTLED) {
    return "Settled";
  } else if (status === ORDER_STATUS.WAITING_FOR_PAYMENT) {
    return "Waiting for payment";
  } else if (status === ORDER_STATUS.REJECTED) {
    return "Rejected";
  } else if (status === ORDER_STATUS.EXPIRED) {
    return "Expired";
  } else if (status === ORDER_STATUS.ON_GOING) {
    return "On going";
  } else if (status === ORDER_STATUS.COMPLETED) {
    return "Completed";
  } else if (status === ORDER_STATUS.USER_PICKED_UP) {
    return "User picked up";
  } else if (status === ORDER_STATUS.PREPARED) {
    return "Prepared";
  } else if (status === ORDER_STATUS.PAID) {
    return "Paid";
  } else {
    return "Preparing";
  }
};

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setCurrentStore, store, currentStore } = useContext(AppContext);
  const [showConfirmOrder, setShowConfirmOrder] = useState(false);
  const [selectOrderId, setSelectOrderId] = useState("");

  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const [numPerPage, setNumPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");

  const params = { perPage: numPerPage, paginationMetadataStyle: "body", page: currentPage, search_value: searchKey };

  let url = storeId ? ORDER_TRACKING_URL(storeId as string) : "";
  const { data, total, refresh: refreshList } = useFetchList<MerchantOrderResponse>(url, params);

  const orders: any[] = useMemo(() => {
    return data?.map((order: MerchantOrderResponse) => {
      return {
        create_time: order.create_time,
        id: order.id,
        name: order.store.merchant.name,
        note: order.note,
        phone: order.shipments?.[0]?.data?.recipient?.phone,
        address: order.shipments?.[0]?.address,
        status: getOrderStatus(order.status),
        originalStatus: order.status,
        items: order.items,
        payment: order.payment,
      };
    });
  }, [data]);

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
    setCurrentPage(current);
    setNumPerPage(pageSize);
  };

  function onSearch(value: string) {
    if (value !== searchKey) {
      setSearchKey(value);
    }
  }

  const confirmOrder = async () => {
    if (!selectOrderId) {
      toast.error("No order selected");
      return;
    }
    const url = ORDER_TRACKING_CONFIRM_URL(selectOrderId);
    await defaultAxios.put<{}>(url, {});
    refreshList();
    setSelectOrderId("");
    setShowConfirmOrder(false);
    toast.success("Confirm order success");
  };

  function pageChange(page: number, pageSize: number) {
    setCurrentPage(page);
    setNumPerPage(pageSize);
  }

  function linKtoOrderDetail(valueId: number) {
    navigate(navigations.STORES.ORDER_TRACKING_DETAIL(storeId ? storeId : "", valueId));
  }

  function onClickConfirmOrder(id: string) {
    setSelectOrderId(id);
    setShowConfirmOrder(true);
  }

  const dataSource = orders.map((value, index) => ({
    key: <div onClick={() => linKtoOrderDetail(value.id)}>{value.id}</div>,
    order: (
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }} onClick={() => linKtoOrderDetail(value.id)}>
        {value.id}
        {value.note && (
          <Tooltip
            placement="top"
            title={value.note}
            arrow={{
              pointAtCenter: true,
            }}
          >
            <div style={{ cursor: "pointer" }}>
              <NoteIcon />
            </div>
          </Tooltip>
        )}
      </div>
    ),
    phoneNumber: <div onClick={() => linKtoOrderDetail(value.id)}>{value.phone}</div>,
    deliveryAddress: <div onClick={() => linKtoOrderDetail(value.id)}>{value.address}</div>,
    status:
      value.status === ON_GOING ? (
        <GradientText text={value.status} onClick={() => linKtoOrderDetail(value.id)} />
      ) : (
        <div className={`status__${value.status}`} onClick={() => linKtoOrderDetail(value.id)}>
          {value.status}
        </div>
      ),
    amount: <div onClick={() => linKtoOrderDetail(value.id)}>{format2Digit(value.payment.amount)}</div>,
    profit: <div>{format2Digit(value.profit)}</div>,
    time: (
      <div onClick={() => linKtoOrderDetail(value.id)}>
        {moment(value.create_time).format("DD/MM/YYYY") + ", " + moment(value.create_time).format("HH:mm")}
      </div>
    ),
    action: (
      <div>
        {value && value.originalStatus === ORDER_STATUS.ON_GOING && (
          <PrimaryButton onClick={() => onClickConfirmOrder(value.id)} style={{ padding: "0px 0px" }}>
            Confirm Order
          </PrimaryButton>
        )}
      </div>
    ),
  }));

  const columns: ColumnsType<any> = [
    {
      title: "Order ID",
      dataIndex: "order",
      key: "order",
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: "Delivery address",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => <div>{text}</div>,
    },

    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text, record) => <div>{text}</div>,
    },
  ];

  return (
    <>
      <div className="order_detail_page">
        <h3>{`${trim(currentStore?.name)} - Order List`}</h3>

        <SearchInput placeholder="Search for order ID" type="search" onSearch={value => onSearch(value)} />

        <div className="pagination">
          <CustomPagination
            defaultCurrent={1}
            showSizeChanger
            current={currentPage}
            onChange={pageChange}
            total={total}
            onShowSizeChange={onShowSizeChange}
          />
        </div>

        <CustomTable dataSource={dataSource} columns={columns} pagination={false} style={{ cursor: "pointer" }} />

        <ConfirmPopup
          open={showConfirmOrder}
          onCancel={() => setShowConfirmOrder(false)}
          title="Confirm Order"
          description={`Are you sure you want to confirm?`}
          onConfirm={() => confirmOrder()}
        />
      </div>
    </>
  );
};

export default OrderList;
