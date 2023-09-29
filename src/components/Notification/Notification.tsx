import { Badge, List } from "antd";
import dayjs from "dayjs";
import _, { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../commons/components/CustomPagination";
import { NOTIFICATION_LIST, NOTIFICATION_READ } from "../../commons/constants/api-urls";
import { navigations } from "../../commons/constants/routers";
import defaultAxios from "../../commons/utils/axios";
import "./styles.scss";

export const STATUS_CODE = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
};

export enum MerchantNotificationEventName {
  MerchantAccountDeactivated = "MERCHANT_ACCOUNT_DEACTIVATED",
  MerchantStoreCreated = "MERCHANT_STORE_CREATED",
  MerchantStoreUpdated = "MERCHANT_STORE_UPDATED",
  ProductCreatedApproval = "PRODUCT_CREATION_APPROVAL",
  ProductEditApproval = "PRODUCT_EDIT_APPROVAL",
  ProductQuantityUpdated = "PRODUCT_QUANTITY_UPDATED",
  ProductQuantityRunOut = "PRODUCT_QUANTITY_RUN_OUT",
  ProductQuantityOutOfStock = "PRODUCT_QUANTITY_OUT_OF_STOCK",
  ProductCloned = "PRODUCT_CLONED",
  CampaignRunning = "CAMPAIGN_RUNNING",
  CampaignUpdated = "CAMPAIGN_UPDATED",
  CampaignStopped = "CAMPAIGN_STOPPED",
  VoucherActivated = "VOUCHER_ACTIVATED",
  VoucherDeactivated = "VOUCHER_DEACTIVATED",
  BadgePublished = "BADGE_PUBLISHED",
  RefundCreated = "REFUND_CREATED",
  LPReceived = "LP_RECEIVED",
  LPSpent = "LP_SPENT",
  MBSUpgraded = "MBS_UPGRADED",
}

const Notification: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState<any>({
    page: 0,
    perPage: 10,
    paginationMetadataStyle: "body",
  });
  const [page, setPage] = useState(1);
  const [dataSrc, setDataSrc] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [metadata, setMetadata] = useState<any>({
    "x-total-count": 0,
    "x-pages-count": 0,
  });

  useEffect(() => {
    let interval = setInterval(async () => {
      loadNotifications();
    }, 2000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const loadNotifications = async () => {
    try {
      const res = await defaultAxios.get(NOTIFICATION_LIST, { params });
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        setDataSrc(res.data?.data);
      }
      if (res.data.metadata && res.status === STATUS_CODE.SUCCESS) {
        setMetadata(res.data.metadata);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const redirectRoute = (item: any) => {
    const path = item?.meta?.eventName;
    const storeId = item?.meta?.storeId;
    const productId = item?.meta?.productId;
    const voucherId = item?.meta?.voucherId;
    const campaignId = item?.meta?.campaignId;
    if (path === MerchantNotificationEventName.MBSUpgraded) {
      navigate(navigations.LP_MEMBER_SHIP.MEMBERSHIP);
    } else if (path === MerchantNotificationEventName.RefundCreated) {
      navigate(navigations.STORES.REFUND_MANAGEMENT(storeId));
    } else if (path === MerchantNotificationEventName.BadgePublished) {
      navigate(navigations.STORES.BADGE_MANAGEMENT(storeId));
    } else if (path === MerchantNotificationEventName.LPReceived || path === MerchantNotificationEventName.LPSpent) {
      navigate(navigations.LP_MEMBER_SHIP.LOYALTY_POINTS);
    } else if (path === MerchantNotificationEventName.MerchantAccountDeactivated) {
      navigate(navigations.MERCHANT_MEMBER);
    } else if (
      path === MerchantNotificationEventName.MerchantStoreCreated ||
      path === MerchantNotificationEventName.MerchantStoreUpdated
    ) {
      navigate(navigations.STORES.STORE_DASHBOARD(storeId));
    } else if (
      path === MerchantNotificationEventName.ProductCreatedApproval ||
      path === MerchantNotificationEventName.ProductEditApproval ||
      path === MerchantNotificationEventName.ProductCloned
    ) {
      navigate(navigations.STORES.UPDATE_PRODUCT(storeId, productId));
    } else if (
      path === MerchantNotificationEventName.VoucherActivated ||
      path === MerchantNotificationEventName.VoucherDeactivated
    ) {
      navigate(navigations.STORES.VOUCHER_DETAIL(storeId, voucherId));
    } else if (
      path === MerchantNotificationEventName.CampaignRunning ||
      path === MerchantNotificationEventName.CampaignUpdated ||
      path === MerchantNotificationEventName.CampaignStopped
    ) {
      navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_DETAIL(campaignId));
    } else {
      navigate(navigations.STORES.PRODUCT_MANAGEMENT(storeId));
    }
  };

  const handleRead = async (item: any) => {
    try {
      if (dayjs(item.read_at).isValid()) {
      } else {
        await defaultAxios.put(NOTIFICATION_READ(item.id));
        await loadNotifications();
        console.log("Read success");
      }
      redirectRoute(item);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleTitle = (item: any) => {
    const { content } = item;
    const { message } = content;
    let messageCLone = cloneDeep(message);
    const listKey = _.keys(content).filter(item => item !== "message");
    let res;
    if (listKey.length > 0) {
      res = listKey.reduce((message: string, value: string) => {
        return (message as string)?.replace(
          `:${value}`,
          `<span style="color:#fff ; font-weight: 600">${content[value]}</span>`
        );
      }, messageCLone);
    } else {
      res = message;
    }

    return {
      __html: `<div style="font-size: 14px; color: #ABABB1; cursor: pointer ; font-weight: 400;">${res}</div>`,
    };
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    setLoading(true);
    setParams({
      ...params,
      page,
      perPage: pageSize,
    });
    setPage(page);
  };

  return (
    <>
      <div className="title">Notifications</div>
      <div
        id="scrollableDiv"
        style={{
          marginBottom: 24,
        }}
      >
        <List
          dataSource={dataSrc}
          loading={
            loading
              ? {
                  tip: "Loading...",
                }
              : false
          }
          renderItem={item => (
            <List.Item
              key={item?.id}
              onClick={() => handleRead(item)}
              style={!dayjs(item.read_at).isValid() ? {} : { opacity: 0.6 }}
            >
              <List.Item.Meta
                title={<div dangerouslySetInnerHTML={handleTitle(item)} />}
                description={<div className="date">{dayjs(item?.notify_at).format("DD/MM/YYYY HH:mm")}</div>}
              />
              <div>{!dayjs(item.read_at).isValid() && <Badge key={"blue"} color={"#F4E85B"} />}</div>
            </List.Item>
          )}
        />
      </div>
      <CustomPagination
        defaultCurrent={1}
        current={page}
        showSizeChanger
        onChange={handleChangePagination}
        total={metadata["x-total-count"]}
      />
    </>
  );
};

export default Notification;
