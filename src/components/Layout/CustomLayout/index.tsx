import { Badge, Breadcrumb, Col, Dropdown, Layout, Menu, Row, Space } from "antd";
import dayjs from "dayjs";
import _, { cloneDeep, trim } from "lodash";
import { FC, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NOTIFICATION_COUNT, NOTIFICATION_LIST, NOTIFICATION_READ } from "../../../commons/constants/api-urls";
import { menus } from "../../../commons/constants/menus";
import { navigations, routers } from "../../../commons/constants/routers";
import { ArrowRight, Notification, TrifoodLogo } from "../../../commons/resources";
import defaultAxios from "../../../commons/utils/axios";
import { AppContext } from "../../../contexts/AppContext";
import { MerchantNotificationEventName, STATUS_CODE } from "../../Notification/Notification";
import AccountDropdown from "./AccountDropdown";
import "./custom-layout.module.scss";
import styles from "./custom-layout.module.scss";
import "./index.scss";

const CustomLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { currentStore } = useContext(AppContext);
  const { pathname } = useLocation();
  const [countNoti, setCountNoti] = useState(0);
  const [dataSrc, setDataSrc] = useState<any[]>([]);

  const isDetailChecking = pathname.split("/").length === 5 && pathname.includes("order-tracking");

  useEffect(() => {
    let interval = setInterval(async () => {
      loadNotifications();
    }, 2000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleViewAll = () => {
    navigate(routers.NOTIFICATION);
  };

  const loadNotifications = async () => {
    try {
      let params = { page: 0, perPage: 20, paginationMetadataStyle: "body" };
      const res = await defaultAxios.get(NOTIFICATION_LIST, { params });
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        setDataSrc(res.data?.data);
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    let interval = setInterval(async () => {
      const res = await defaultAxios.get(NOTIFICATION_COUNT);
      if (res.data?.unread >= 0 && res.status === STATUS_CODE.SUCCESS) {
        setCountNoti(res.data?.unread);
      }
    }, 2000);
    return () => {
    clearInterval(interval);
    };
  }, []);

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
      __html: `<div style="font-size: 14px; color: #ABABB1; font-weight: 400; cursor: pointer">${res}</div>`,
    };
  };

  function getActivePathName(pathname: string) {
    const orderTrackingPath = navigations.STORES.ORDER_TRACKING(currentStore?.id ? currentStore?.id : "");
    if (pathname.startsWith(orderTrackingPath)) {
      return orderTrackingPath;
    }

    const refundManagement = navigations.STORES.REFUND_MANAGEMENT(currentStore?.id ? currentStore?.id : "");
    if (pathname.startsWith(refundManagement)) {
      return refundManagement;
    }

    const rateManagement = navigations.STORES.RATE_MANAGEMENT(currentStore?.id ? currentStore?.id : "");
    if (pathname.startsWith(rateManagement)) {
      return rateManagement;
    }

    const recon = routers.RECONCILIATION;
    if (pathname.startsWith(recon)) {
      return recon;
    }

    const campaign = routers.LP_MEMBER_SHIP.CAMPAIGN_LIST;
    if (pathname.startsWith("/lp-membership/campaign")) {
      return campaign;
    }

    return pathname;
  }

  const titleLevel2 = useMemo(() => {
    if (
      pathname.includes(routers.LP_MEMBER_SHIP.INFO) ||
      pathname.includes(routers.LP_MEMBER_SHIP.MEMBERSHIP) ||
      pathname.includes(routers.LP_MEMBER_SHIP.LP_BUY_MORE) ||
      pathname.includes(routers.LP_MEMBER_SHIP.LP_CASH_OUT) ||
      pathname.includes(routers.LP_MEMBER_SHIP.CAMPAIGN_LIST) ||
      pathname.includes(routers.LP_MEMBER_SHIP.CAMPAIGN_DETAIL)
    ) {
      return "LP & Membership";
    } else if (pathname.includes(routers.LP_MEMBER_SHIP.LOYALTY_POINTS)) {
      return "Loyalty points transactions";
    } else if (pathname.includes("/lp-membership/campaign-detail")) {
      return "Campaign detail";
    } else if (pathname.includes("/rate/")) {
      return "Rating detail";
    } else if (pathname.includes("/notification")) {
      return "Notifications";
    } else if (pathname.includes("/settlement-report")) {
      return "Settlement report";
    } else {
      return "";
    }
  }, [pathname]);

  const subTitle = useMemo(() => {
    if (
      pathname.includes(routers.STORES.PRODUCT_MANAGEMENT.replace(":storeId", currentStore?.id as any)) ||
      pathname.includes(routers.STORES.CREATE_PRODUCT.replace(":storeId", currentStore?.id as any))
    ) {
      return "Product management";
      // }
      //  else if (pathname.includes(routers.STORES.MERCHANT_LANDING_PAGE.replace(":storeId", currentStore?.id as any))) {
      // return "Merchant Landing Page";
      // } else if (pathname.includes(routers.STORES.BADGE_MANAGEMENT.replace(":storeId", currentStore?.id as any))) {
      //   return "Badge Management";
      // } else if (pathname.includes(routers.STORES.CREATE_BADGE.replace(":storeId", currentStore?.id as any))) {
      //   return "Create new Badge";
    } else if (pathname.includes(routers.STORES.ORDER_TRACKING.replace(":storeId", currentStore?.id as any))) {
      return "Order Tracking";
    } else if (pathname.includes(routers.STORES.ORDER_TRACKING_DETAIL.replace(":storeId", currentStore?.id as any))) {
      return "Order Detail";

      // } else if (pathname.includes(routers.STORES.REFUND_MANAGEMENT.replace(":storeId", currentStore?.id as any))) {
      //   return "Refund Management";
    } else if (pathname.includes(routers.STORES.RATE_MANAGEMENT.replace(":storeId", currentStore?.id as any))) {
      return "Rate Management";
      // } else if (pathname.includes(routers.STORES.CHAT_INBOX.replace(":storeId", currentStore?.id as any))) {
      //   return "Chat Inbox";
    } else if (pathname.includes(routers.STORES.REPORT.replace(":storeId", currentStore?.id as any))) {
      return "Report";
      // } else if (
      //   pathname.includes(routers.STORES.INVENTORY_MANAGEMENT.replace(":storeId", currentStore?.id as any)) ||
      //   pathname.includes("inventory-log")
      // ) {
      //   return "Inventory Management";
      // } else if (pathname.includes(routers.STORES.VOUCHER_LIST.replace(":storeId", currentStore?.id as any))) {
      //   return "Voucher list";
    } else if (pathname.includes(`/voucher/`) || pathname.includes("/edit-voucher/")) {
      return "Voucher detail";
    } else if (pathname.includes(routers.STORES.CREATE_VOUCHER.replace(":storeId", currentStore?.id as any))) {
      return "Voucher management";
    } else if (
      pathname.includes(routers.LP_MEMBER_SHIP.CAMPAIGN_LIST) ||
      pathname.includes(routers.LP_MEMBER_SHIP.CAMPAIGN_DETAIL)
    ) {
      return "Marketing Campaign";
    } else {
      return "Store management";
    }
  }, [pathname, currentStore?.id]);

  const subTitle2 = useMemo(() => {
    if (pathname.includes(routers.STORES.CREATE_PRODUCT.replace(":storeId", currentStore?.id as any))) {
      return "Add new product";
    } else {
      return "";
    }
  }, [pathname, currentStore?.id]);

  let activePathName = getActivePathName(pathname);

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

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Layout.Sider trigger={null} collapsible width={280} className={styles.slider_menu}>
        <Link to={routers.DASHBOARD} className={styles.logoLink}>
          <TrifoodLogo width="auto" height={40} />
        </Link>
        <Menu
          className={styles.menu}
          theme="dark"
          mode="inline"
          selectedKeys={[activePathName]}
          defaultOpenKeys={[routers.STORES.LIST]}
          // onSelect={item => navigate(item.key)}
          style={{ height: "calc(100% - 80px)", overflow: "auto" }}
          items={menus
            .filter(value => {
              if (!currentStore && value.isStore) {
                return false;
              }
              return true;
            })
            .map(({ isStore, path, icon: Icon, label, hasNoty, children, count, renderPath }) => {
              if (children && path === routers.LP_MEMBER_SHIP.INFO) {
                return {
                  key: path,
                  path: path,
                  label: (
                    <Link to={path}>
                      <span>{label}</span>
                      {hasNoty && <span className={styles.menuItemCount}>{count || 0}</span>}
                    </Link>
                  ),
                  icon: <Icon />,
                  children: children.map(item => ({
                    key: item.path,
                    path: item.path,
                    label: (
                      <Menu.Item>
                        <Link to={item.path}>{item.label}</Link>
                      </Menu.Item>
                    ),
                  })),
                };
              }
              if (!isStore || !currentStore || !children) {
                return {
                  key: (currentStore && renderPath?.(currentStore?.id)) || path,
                  path: (currentStore && renderPath?.(currentStore?.id)) || path,
                  label: (
                    <Link to={(currentStore && renderPath?.(currentStore?.id)) || path}>
                      <span>{label}</span>
                      {path === routers.NOTIFICATION && hasNoty && (
                        <span className={styles.menuItemCount}>{countNoti || 0}</span>
                      )}
                    </Link>
                  ),
                  icon: <Icon />,
                };
              }

              return {
                key: (currentStore && renderPath?.(currentStore?.id)) || path,
                path: (currentStore && renderPath?.(currentStore?.id)) || path,
                label: (
                  <Link to={(currentStore && renderPath?.(currentStore?.id)) || path}>
                    <span>{isStore ? `${trim(currentStore.name)}` : label}</span>
                    {/* {hasNoty && <span className={styles.menuItemCount}>{count || 0}</span>} */}
                  </Link>
                ),
                icon: <Icon />,
                children: children.map(item => ({
                  key: (currentStore && item.renderPath?.(currentStore?.id)) || item.path,
                  path: (currentStore && item.renderPath?.(currentStore?.id)) || item.path,
                  label: (
                    <Menu.Item>
                      <Link to={(currentStore && item.renderPath?.(currentStore?.id)) || item.path}>{item.label}</Link>
                    </Menu.Item>
                  ),
                })),
              };
            })}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header className={styles.header}>
          <Breadcrumb separator="" className={styles.breadcrumb_cover}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            {pathname !== "/" && (
              <Breadcrumb.Separator>
                <ArrowRight />
              </Breadcrumb.Separator>
            )}
            {Number(currentStore?.id) > 0 ? (
              <Breadcrumb.Item href={routers.STORES.LIST}>Store</Breadcrumb.Item>
            ) : (
              titleLevel2
            )}
            {currentStore?.id && (
              <Breadcrumb.Separator>
                <ArrowRight />
              </Breadcrumb.Separator>
            )}
            {currentStore?.id && <Breadcrumb.Item>{subTitle}</Breadcrumb.Item>}
            {isDetailChecking && (
              <>
                {" "}
                <Breadcrumb.Separator>
                  <ArrowRight />
                </Breadcrumb.Separator>{" "}
                <Breadcrumb.Item>Order Details</Breadcrumb.Item>{" "}
              </>
            )}

            {subTitle && subTitle === "Marketing Campaign" && (
              <>
                {" "}
                <Breadcrumb.Separator>
                  <ArrowRight />
                </Breadcrumb.Separator>{" "}
                <Breadcrumb.Item>{subTitle}</Breadcrumb.Item>{" "}
              </>
            )}

            {subTitle2 && (
              <>
                {" "}
                <Breadcrumb.Separator>
                  <ArrowRight />
                </Breadcrumb.Separator>{" "}
                <Breadcrumb.Item>{subTitle2}</Breadcrumb.Item>{" "}
              </>
            )}
          </Breadcrumb>
          <Space size={30} className="header_right">
            <Dropdown
              trigger={["hover"]}
              overlay={
                <div className={"dropdownNoti"}>
                  {dataSrc.map(item => {
                    return (
                      <Row
                        key={item.read_at}
                        className="item"
                        onClick={() => handleRead(item)}
                        style={!dayjs(item.read_at).isValid() ? {} : { opacity: 0.6 }}
                      >
                        <Col span={23} className={"record"}>
                          <div dangerouslySetInnerHTML={handleTitle(item)} />
                          <div className="date">{dayjs(item?.notify_at).format("DD/MM/YYYY HH:mm")}</div>
                        </Col>
                        <Col span={1} className="badge">
                          <div>{!dayjs(item.read_at).isValid() && <Badge key={"blue"} color={"#F4E85B"} />}</div>
                        </Col>
                      </Row>
                    );
                  })}
                  <div className="viewAll" onClick={handleViewAll}>
                    View all notifications
                  </div>
                </div>
              }
              placement="bottomRight"
              overlayClassName="dropdown-wrapper"
            >
              <Badge count={countNoti} className="header_noti">
                <Notification />
              </Badge>
            </Dropdown>
            <AccountDropdown />
          </Space>
        </Layout.Header>
        <Layout.Content className={styles.main}>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
