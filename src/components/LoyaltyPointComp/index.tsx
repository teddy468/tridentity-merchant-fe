import { Col, Form, List, message, Row, Skeleton } from "antd";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { cloneDeep, get } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useParams } from "react-router-dom";
import BorderGradientButton from "../../commons/components/BorderGradientButton/BorderGradientButton";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import CustomModal from "../../commons/components/CustomModal/CustomModal";
import GradientText from "../../commons/components/GradientText/GradientText";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import { LP_BUY_MORE, LP_CASH_OUT, LP_POINT, LP_RATE, LP_TRANSACTION } from "../../commons/constants/api-urls";
import { navigations } from "../../commons/constants/routers";
import defaultAxios from "../../commons/utils/axios";
import { formatLP } from "../../commons/utils/functions/formatPrice";
import { AppContext } from "../../contexts/AppContext";
import { STATUS_CODE } from "../Notification/Notification";
import "./index.scss";
import styles from "./lp.module.scss";
import { ModalSubmit } from "./ModalSubmit";

export enum MerchantLoyaltyPointHistoryTypeEnum {
  EARN = "EARN",
  SPEND = "SPEND",
  ADJUST = "ADJUST",
  UPGRADE_MEMBERSHIP = "UPGRADE_MEMBERSHIP",
  CASH_OUT = "CASH_OUT_CREATED",
  CASH_OUT_REJECTED = "CASH_OUT_REJECTED",
  LP_BUYING = "LP_BUYING_APPROVED",
  CAMPAIGN_CREATED = "CAMPAIGN_CREATED",
  CAMPAIGN_ENDED = "CAMPAIGN_ENDED",
  CAMPAIGN_BUDGET_ADDED = "CAMPAIGN_BUDGET_ADDED",
  CAMPAIGN_BUDGET_SUBTRACTED = "CAMPAIGN_BUDGET_SUBTRACTED",
}

function checkType(type: string) {
  if (
    type === MerchantLoyaltyPointHistoryTypeEnum.EARN ||
    type === MerchantLoyaltyPointHistoryTypeEnum.LP_BUYING ||
    type === MerchantLoyaltyPointHistoryTypeEnum.CAMPAIGN_ENDED ||
    type === MerchantLoyaltyPointHistoryTypeEnum.CAMPAIGN_BUDGET_SUBTRACTED ||
    type === MerchantLoyaltyPointHistoryTypeEnum.CASH_OUT_REJECTED
  ) {
    return "EARN";
  }

  return "SPEND";
}

const LoyaltyPointComp: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openModalBuyMore, setOpenModalBuyMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<any>({
    page: 1,
    perPage: 10,
    paginationMetadataStyle: "body",
  });
  const [metadata, setMetadata] = useState<any>({
    "x-total-count": 0,
    "x-pages-count": 0,
  });
  const [dataSrc, setDataSrc] = useState<any[]>([]);
  const [dataPoint, setDataPoint] = useState<any>({});
  const [form] = Form.useForm<{}>();
  const [amount, setAmount] = useState("0");
  const [exchangeRate, setExchangeRate] = useState<any>({});
  const [openModalSubmit, setOpenModalSubmit] = useState(false);
  const [id, setId] = useState(0);
  const [openModalSubmit2, setOpenModalSubmit2] = useState(false);
  const [id2, setId2] = useState(0);

  const amountToSingaporeDollar = useMemo(() => {
    return new BigNumber(amount).multipliedBy(exchangeRate?.sgd_rate).div(exchangeRate?.lp_rate).toFixed(2, 1);
  }, [amount, exchangeRate?.sgd_rate, exchangeRate?.lp_rate]);

  const getExchangeRate = async () => {
    try {
      const res = await defaultAxios.get(LP_RATE);
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setExchangeRate(res.data);
      }
    } catch (error) {}
  };

  const loadLpTransaction = async () => {
    try {
      setLoading(true);
      const res = await defaultAxios.get(LP_TRANSACTION, { params });
      if (res.data?.data && res.status === STATUS_CODE.SUCCESS) {
        setDataSrc([...dataSrc, ...res.data?.data]);
      }
      if (res.data.metadata && res.status === STATUS_CODE.SUCCESS) {
        setMetadata(res.data.metadata);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPoint = async () => {
    try {
      const res = await defaultAxios.get(LP_POINT);
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setDataPoint(res.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    loadLpTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    getCurrentPoint();
  }, []);

  useEffect(() => {
    getExchangeRate();
  }, []);

  const handleNext = () => {
    let cloneParam = cloneDeep(params);
    cloneParam.page = get(cloneParam, "page", 1) + 1;
    if (cloneParam.page >= metadata["x-pages-count"]) {
      console.log("STOP");
      return;
    }
    setParams(cloneParam);
  };

  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const getType = (item: any) => {
    if (
      item.type === MerchantLoyaltyPointHistoryTypeEnum.EARN ||
      item.type === MerchantLoyaltyPointHistoryTypeEnum.SPEND ||
      item.type === MerchantLoyaltyPointHistoryTypeEnum.ADJUST
    ) {
      return (
        <div>
          Order ID: <span className={styles.text1}>{item?.order_id}</span>
        </div>
      );
    } else if (item.type === MerchantLoyaltyPointHistoryTypeEnum.UPGRADE_MEMBERSHIP) {
      return (
        <div>
          Upgrade membership: <span className={styles.text1}>{item?.merchant_id}</span>
        </div>
      );
    } else if (item.type === MerchantLoyaltyPointHistoryTypeEnum.LP_BUYING) {
      return (
        <div>
          Buy LP Request: <span className={styles.text1}>{item?.lp_buying_request_id}</span>
        </div>
      );
    } else if (
      item.type === MerchantLoyaltyPointHistoryTypeEnum.CASH_OUT ||
      item.type === MerchantLoyaltyPointHistoryTypeEnum.CASH_OUT_REJECTED
    ) {
      return (
        <div>
          LP Cash Out: <span className={styles.text1}>{item?.lp_cash_out_request_id}</span>
        </div>
      );
    } else if (item.type === MerchantLoyaltyPointHistoryTypeEnum.CAMPAIGN_CREATED) {
      return (
        <div>
          Campaign Created: <span className={styles.text1}>{item?.campaign.name}</span>
        </div>
      );
    } else if (item.type === MerchantLoyaltyPointHistoryTypeEnum.CAMPAIGN_ENDED) {
      return (
        <div>
          Campaign Ended: <span className={styles.text1}>{item?.campaign.name}</span>
        </div>
      );
    } else if (
      item.type === MerchantLoyaltyPointHistoryTypeEnum.CAMPAIGN_BUDGET_ADDED ||
      item.type === MerchantLoyaltyPointHistoryTypeEnum.CAMPAIGN_BUDGET_SUBTRACTED
    ) {
      return (
        <div>
          Campaign budge edited: <span className={styles.text1}>{item?.campaign.name}</span>
        </div>
      );
    } else {
      return (
        <div>
          Order ID: <span className={styles.text1}>{item?.order_id}</span>
        </div>
      );
    }
  };

  const renderDescription = (item: any) => {
    const isEarn = checkType(item?.type) === "EARN";
    const amountToSingaporeDollar = new BigNumber(item?.point || 0)
      .multipliedBy(exchangeRate?.sgd_rate)
      .div(exchangeRate?.lp_rate)
      .toFixed(2, 1);
    return (
      <div className={styles.description}>
        {getType(item)}

        <div>
          Status: <span className={styles.text2}>Completed</span>
        </div>
        {item.type === MerchantLoyaltyPointHistoryTypeEnum.LP_BUYING ? (
          <div>S$ {amountToSingaporeDollar} Paid</div>
        ) : item.type === MerchantLoyaltyPointHistoryTypeEnum.CASH_OUT ? (
          <div>S$ {amountToSingaporeDollar} Cash out</div>
        ) : (
          <div>
            S$ {amountToSingaporeDollar} {isEarn ? "earning" : "spending"}
          </div>
        )}
      </div>
    );
  };

  const handleCancel = () => {
    setOpenModal(false);
    setOpenModalBuyMore(false);
    form.resetFields();
    setAmount("0");
  };

  const openOrderDetail = (item: any) => {
    if (
      item.type === MerchantLoyaltyPointHistoryTypeEnum.EARN ||
      item.type === MerchantLoyaltyPointHistoryTypeEnum.SPEND ||
      item.type === MerchantLoyaltyPointHistoryTypeEnum.ADJUST
    ) {
      const storeId = item?.order?.merchant_store_id;
      const orderId = item?.order_id;
      if (orderId && storeId) {
        navigate(navigations.STORES.ORDER_TRACKING_DETAIL(storeId, orderId));
      }
    } else if (item.type === MerchantLoyaltyPointHistoryTypeEnum.LP_BUYING) {
      navigate(navigations.LP_MEMBER_SHIP.LP_BUY_MORE);
    } else if (
      item.type === MerchantLoyaltyPointHistoryTypeEnum.CASH_OUT ||
      item.type === MerchantLoyaltyPointHistoryTypeEnum.CASH_OUT_REJECTED
    ) {
      navigate(navigations.LP_MEMBER_SHIP.LP_CASH_OUT);
    } else if (item.type === MerchantLoyaltyPointHistoryTypeEnum.UPGRADE_MEMBERSHIP) {
      navigate(navigations.LP_MEMBER_SHIP.MEMBERSHIP);
    } else {
      navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_DETAIL(item?.campaign_id));
    }
  };

  const handleBuyMore = async (values: any) => {
    const { lp_amount } = values;
    try {
      setLoading(true);
      let body = {
        lp_amount: Number(lp_amount),
      };
      const response = await defaultAxios.post(LP_BUY_MORE, body);

      if (response.status >= 200 && response.status < 400) {
        handleCancel();
        setId(response.data.id);
        setOpenModalSubmit(true);
      } else {
        throw response;
      }
    } catch (error) {
      message.error("Buy more LP fail!");
    } finally {
      setLoading(false);
    }
  };

  const handleCashOut = async (values: any) => {
    const { lp_amount } = values;
    try {
      setLoading(true);
      let body = {
        lp_amount: Number(lp_amount),
      };
      const response = await defaultAxios.post(LP_CASH_OUT, body);
      if (response.status >= 200 && response.status < 400) {
        handleCancel();
        setId2(response.data.id);
        setOpenModalSubmit2(true);
      } else {
        throw response;
      }
    } catch (error) {
      message.error(get(error, "response.data.error.message", "LP Cash out quantity fail!"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{`Loyalty points transactions`}</div>
        <PrimaryButton className={styles.addProductBtn} onClick={() => setOpenModalBuyMore(true)}>
          Buy more LP
        </PrimaryButton>
        <PrimaryButton className={styles.addProductBtn} style={{ marginLeft: 22 }} onClick={() => setOpenModal(true)}>
          Request LP cash out
        </PrimaryButton>
        <PrimaryButton
          className={styles.addProductBtn}
          style={{ marginLeft: 22 }}
          onClick={() => navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_LIST)}
        >
          Marketing Campaign
        </PrimaryButton>
      </div>
      <div className={styles.textCenter}>
        Current Loyalty Points: <span>{formatLP(dataPoint?.total_point || 0)}</span>{" "}
      </div>
      <Row>
        <Col span={24}>
          <div
            id="scrollableDiv"
            style={{
              height: "70vh",
              overflow: "auto",
              padding: "0 16px",
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              border: "1px solid rgba(140, 140, 140, 0.35)",
              background: "#212124",
            }}
          >
            <InfiniteScroll
              dataLength={dataSrc.length}
              next={handleNext}
              hasMore={dataSrc.length <= metadata["x-total-count"]}
              loader={loading ? <Skeleton avatar paragraph={{ rows: 1 }} active /> : null}
              endMessage={""}
              scrollableTarget="scrollableDiv"
            >
              <List
                dataSource={dataSrc}
                locale={{ emptyText: <div style={{ color: "white" }}>No data</div> }}
                renderItem={(item, index) => {
                  const isEarn = checkType(item?.type) === "EARN";
                  return (
                    <List.Item key={item.email} style={{ cursor: "pointer" }} onClick={() => openOrderDetail(item)}>
                      <List.Item.Meta
                        avatar={
                          <img
                            src={isEarn ? "/images/earn.svg" : "/images/spend.svg"}
                            alt="icon"
                            style={{ width: 48, height: 48 }}
                          />
                        }
                        title={<span>{isEarn ? "Earn" : "Spend"}</span>}
                        description={renderDescription(item)}
                      />
                      <div className={styles.infor}>
                        <div className={`content ${isEarn ? "active" : "deactive"}`}>
                          {isEarn ? "+" : "-"} {formatLP(item?.point || 0)}
                        </div>
                        <div className={styles.date}>{dayjs(item?.create_time).format("DD/MM/YYYY, HH:mm")}</div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </InfiniteScroll>
          </div>
        </Col>
      </Row>
      <CustomModal
        maskClosable={false}
        footer={<></>}
        title="Buy LP Request "
        open={openModalBuyMore}
        onCancel={handleCancel}
      >
        <Form id="lp-buy-more" form={form} onFinish={handleBuyMore} style={{ marginTop: 32 }}>
          <CustomInput
            type={"number"}
            label="Enter amount of LP"
            rules={[
              {
                required: true,
                message: "Please enter LP amount",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && value <= 0) {
                    return Promise.reject(new Error("Amount must be greater than 0"));
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
            name="lp_amount"
            placeholder="Enter LP amount"
            onWheel={(e: any) => e.target.blur()}
            value={amount}
            onChange={e => {
              if (!e.target.value) {
                setAmount("0");
              } else {
                setAmount(e.target.value);
              }
            }}
          />
          <div className={styles.groupButton}>
            <div className={styles.amount}>
              {amount} LP = ${amountToSingaporeDollar}
            </div>
            <Row style={{ width: "100%" }}>
              <Col span={12}>
                <BorderGradientButton
                  disabled={loading}
                  style={{ width: "90%", marginBottom: 0 }}
                  onClick={handleCancel}
                >
                  <GradientText text="Cancel" />
                </BorderGradientButton>
              </Col>
              <Col span={12}>
                <PrimaryButton disabled={loading} style={{ width: "90%", marginLeft: "10%" }} type="submit">
                  Submit
                </PrimaryButton>
              </Col>
            </Row>
          </div>
        </Form>
      </CustomModal>

      {openModal && (
        <CustomModal maskClosable={false} footer={<></>} title="LP Cash Out" open={openModal} onCancel={handleCancel}>
          <Form id="lp-cashout" form={form} onFinish={handleCashOut} style={{ marginTop: 32 }}>
            <div className={styles.currentPoint}>
              Current Loyalty Points: <span>{formatLP(dataPoint?.total_point) || 0}</span>{" "}
            </div>
            <CustomInput
              type={"number"}
              label="Enter amount of LP you want to cashout"
              rules={[
                {
                  required: true,
                  message: "Please enter LP amount",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const max = dataPoint ? dataPoint.total_point : 0;
                    if (value && value <= 0) {
                      return Promise.reject(new Error("Amount must be greater than 0"));
                    }
                    if (value && value > max) {
                      return Promise.reject(new Error("Amount must be less than or equal Current Loyalty Points"));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              name="lp_amount"
              placeholder="Enter LP amount"
              onWheel={(e: any) => e.target.blur()}
              value={amount}
              onChange={e => {
                if (!e.target.value) {
                  setAmount("0");
                } else {
                  setAmount(e.target.value);
                }
              }}
            />
            <div className={styles.groupButton}>
              <div className={styles.amount}>
                {amount} LP = ${amountToSingaporeDollar}
              </div>
              <Row style={{ width: "100%" }}>
                <Col span={12}>
                  <BorderGradientButton
                    disabled={loading}
                    style={{ width: "90%", marginBottom: 0 }}
                    onClick={handleCancel}
                  >
                    <GradientText text="Cancel" />
                  </BorderGradientButton>
                </Col>
                <Col span={12}>
                  <PrimaryButton disabled={loading} style={{ width: "90%", marginLeft: "10%" }} type="submit">
                    Submit
                  </PrimaryButton>
                </Col>
              </Row>
            </div>
          </Form>
        </CustomModal>
      )}

      <ModalSubmit
        id={id}
        openModal={openModalSubmit}
        setOpenModal={(value: boolean) => setOpenModalSubmit(value)}
        content="Your request has been sent to Tridentity Support Center! We will respond to you as soon as possible! Complete payment to receive LP"
      />

      <ModalSubmit
        id={id2}
        openModal={openModalSubmit2}
        setOpenModal={(value: boolean) => setOpenModalSubmit2(value)}
        content="Your request has been sent to Tridentity Support Center! We will respond to you as soon as possible!"
      />
    </div>
  );
};

export default LoyaltyPointComp;
