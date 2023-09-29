import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Collapse } from "antd";
import { get, reverse } from "lodash";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MIN_PLATFORM_ORDER,
  ORDER_TRACKING_CONFIRM_URL,
  ORDER_TRACKING_DETAIL,
} from "../../commons/constants/api-urls";
import { ORDER_STATUS } from "../../commons/constants/order";
import useFetch from "../../commons/hooks/useFetch";
import useToast from "../../commons/hooks/useToast";
import defaultAxios from "../../commons/utils/axios";
import { format2Digit, formatLP } from "../../commons/utils/functions/formatPrice";
import { AppContext } from "../../contexts/AppContext";
import { getOrderStatus } from "./index";
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import GradientText from "../../commons/components/GradientText/GradientText";

const { Panel } = Collapse;

declare interface OrderDetail {
  transactions?: any[];
  id: string;
  note: string;
  phone: string;
  address: string;
  resName: string;
  originalStatus: number;
  status: string;
  statusClass: string;
  items: OrderItem[];
  totalAmount: number;
  events: { time: string; eventName: string }[];
}

const formatDateTime = (dateString: string): string => {
  const date: Date = new Date(dateString);
  return moment(date).format("YYYY-MM-DD HH:mm");
};

const OrderDetailComp: React.FC = () => {
  const toast = useToast();
  const { storeId, orderId } = useParams<{ storeId: string; orderId: string }>();
  const { setCurrentStore, store } = useContext(AppContext);
  const [showConfirmOrder, setShowConfirmOrder] = useState(false);

  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const { data: orderDetailData, refresh } = useFetch<MerchantOrderDetailResponse>(
    orderId ? ORDER_TRACKING_DETAIL + orderId : ""
  );

  function onClickConfirmOrder() {
    setShowConfirmOrder(true);
  }

  const confirmOrder = async () => {
    const url = ORDER_TRACKING_CONFIRM_URL(orderId ? orderId.toString() : "");
    await defaultAxios.put<{}>(url, {});
    setShowConfirmOrder(false);
    toast.success("Confirm order success");
    refresh();
  };

  const orderDetail: OrderDetail = useMemo(() => {
    const events: { time: string; eventName: string }[] = orderDetailData?.histories
      ? orderDetailData.histories.map(orderDetail => {
          return { time: formatDateTime(orderDetail.create_time), eventName: orderDetail.event_name };
        })
      : [];

    const orderSelected: any = {
      id: orderDetailData?.id ? orderDetailData?.id : "",
      note: orderDetailData?.note ? orderDetailData?.note : "",
      resName: orderDetailData?.store.merchant.name ? orderDetailData?.store.merchant.name : "",
      phone: orderDetailData?.shipments?.[0]?.data?.recipient?.phone,
      address: orderDetailData?.shipments?.[0]?.address,
      status: getOrderStatus(orderDetailData?.status as any),
      originalStatus: orderDetailData?.status ? orderDetailData?.status : ORDER_STATUS.ON_GOING,
      items: orderDetailData?.items ? orderDetailData?.items : [],
      totalAmount: orderDetailData?.payment.amount ? orderDetailData?.payment.amount : 0,
      payment: orderDetailData?.payment,
      events: events,
    };
    return orderSelected;
  }, [orderDetailData]);

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  const campaignAmount = orderDetailData?.payment.campaign_loyalty_point;
  const listItemDetail = orderDetail.items;
  const priceInfo = get(orderDetailData, "transactions.[0]", []);
  const amountBreak = get(priceInfo, "amount_breakdown", {
    delivery_fee: 0,
    discount_amount: 0,
    item_amount: 0,
    net_amount: 0,
    platform_fee: 0,
    loyalty_discount_amount: 0,
  });
  const { discount_amount, item_amount, platform_fee } = amountBreak;

  const highestMintOrder = orderDetailData?.payment?.min_order;

  const subtotal = item_amount;

  const total = useMemo(() => {
    if (!highestMintOrder || !orderDetailData) return 0;

    if (subtotal > highestMintOrder) {
      return subtotal;
    } else {
      return highestMintOrder;
    }
  }, [highestMintOrder, orderDetailData]);

  const netIncome = useMemo(() => {
    if (!orderDetailData || !total || !subtotal) return 0;
    if (campaignAmount) {
      return total - platform_fee - discount_amount - campaignAmount;
    } else {
      return total - platform_fee - discount_amount;
    }
  }, [orderDetailData, total]);

  const lpUsed = get(orderDetailData, "payment.loyalty_point", 0);

  const caculateRenderMinOrder = useMemo(() => {
    if (!orderDetailData || !highestMintOrder) return <></>;

    if (subtotal > highestMintOrder) {
      return <></>;
    } else {
      return (
        <div className="order-item">
          <div className="total">Minimum order</div>
          <div className="total-right" style={{ color: "#FFFFFF" }}>
            S$ {format2Digit(highestMintOrder - subtotal)}
          </div>
        </div>
      );
    }
  }, [orderDetailData]);

  return (
    <div className={"order-tracking-page"}>
      <div className={"res-name"}>
        <div className="text-order-detail">Order Detail</div>
        <div className="panel__group text-title">
          <div>Quantity</div>
          <div>Price</div>
        </div>
      </div>

      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
        onChange={onChange}
      >
        {listItemDetail.map((item, index) => {
          return (
            <Panel
              header={
                <div className="panel" key={index}>
                  <div className="panel__prodName">
                    <span>{item.product.name || ""} </span>{" "}
                    {item.campaign_loyalty_point > 0 && <GradientText text={"(Extra LP)"} className={"extraLP"} />}
                  </div>
                  <div className="panel__group">
                    <div className="panel__price">{item.quantity || 0}</div>
                    <div className="panel__price">S$ {format2Digit(item.original_price) || 0}</div>
                  </div>
                </div>
              }
              key={`${index}`}
            >
              {item.bundles.map((b, index) => {
                return (
                  <div className="panel" key={index}>
                    <div className="panel__prodName">{`${b.attribute_name} : ${b.attribute_value}`}</div>
                    <div className="panel__price">S$ {format2Digit(b.price)}</div>
                  </div>
                );
              })}
            </Panel>
          );
        })}
      </Collapse>

      <div
        className="order-item"
        style={{
          borderTop: "1px solid #38383C",
          paddingTop: 12,
        }}
      >
        <div className="total">Subtotal</div>
        <div className="total-right" style={{ color: "#FFFFFF" }}>
          S$ {format2Digit(subtotal)}
        </div>
      </div>
      {caculateRenderMinOrder}
      <div className="order-item">
        <div className="total">Total</div>
        <div className="total-right">S$ {format2Digit(total)}</div>
      </div>
      <div
        className="order-item"
        style={{
          borderTop: "1px solid #38383C",
          paddingTop: 12,
        }}
      >
        <div className="total">Plaform Fee</div>
        <div className="total-right">- S$ {format2Digit(platform_fee)}</div>
      </div>

      <div className="order-item">
        <div className="total">Voucher Discount</div>
        <div className="total-right">- S$ {format2Digit(discount_amount)}</div>
      </div>

      {campaignAmount && campaignAmount > 0 ? (
        <div className="order-item">
          <div className="total">LP used by merchant</div>
          <div className="total-right">LP {formatLP(campaignAmount)}</div>
        </div>
      ) : (
        ""
      )}
      <div
        className="order-item"
        style={{
          borderBottom: "1px solid #38383C",
          paddingBottom: 13,
        }}
      >
        <div className="total">LP used by consumer</div>
        <div className="total-right">LP {lpUsed}</div>
      </div>

      <div className="profit">
        <div className="profit__left">Net Income</div>
        <div className="profit__right">
          <div className="profit__right__net">{`S$ ${format2Digit(netIncome)}`}</div>
          <div className="profit__right__used">{`LP ${lpUsed}`}</div>
        </div>
      </div>

      <div className={"order-body"} style={{ marginTop: 20 }}>
        <span className={"common-header"}>Order Id</span>
        <span className={"common-content"}>{orderDetail?.id}</span>

        <span className={"common-header"}>Order status</span>
        <span className={orderDetail?.statusClass} style={{ marginBottom: "20px" }}>
          {orderDetail?.status}
        </span>

        <span className={"common-header"}>Phone number</span>
        <span className={"common-content"}>{orderDetail?.phone ? orderDetail?.phone : "-"}</span>

        <span className={"common-header"}>Note for restaurant</span>
        <span className={"common-content"}>{orderDetail?.note ? orderDetail?.note : "-"}</span>
      </div>

      <div className={"divider"} />

      <h3>Order tracking</h3>

      <table>
        <thead>
          <tr>
            <th>Events</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {orderDetail &&
            orderDetail.events &&
            reverse(orderDetail.events).map((value, index) => {
              return (
                <tr key={index}>
                  <td>{value.eventName}</td>
                  <td>{value.time}</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <ConfirmPopup
        open={showConfirmOrder}
        onCancel={() => setShowConfirmOrder(false)}
        title="Confirm Order"
        description={`Are you sure you want to confirm?`}
        onConfirm={() => confirmOrder()}
      />
    </div>
  );
};

export default OrderDetailComp;
