import { Col, Form, message, Row } from "antd";
import { ColumnsType } from "antd/es/table";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { debounce, get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BorderGradientButton from "../../commons/components/BorderGradientButton/BorderGradientButton";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import CustomModal from "../../commons/components/CustomModal/CustomModal";
import CustomPagination from "../../commons/components/CustomPagination";
import CustomTable from "../../commons/components/CustomTable";
import GradientText from "../../commons/components/GradientText/GradientText";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import {
  LP_BUY_MORE,
  LP_CASH_OUT,
  LP_CASH_OUT_LIST,
  LP_POINT,
  LP_RATE,
  LP_RECEIVED,
} from "../../commons/constants/api-urls";
import { navigations } from "../../commons/constants/routers";
import defaultAxios from "../../commons/utils/axios";
import { format2Digit, formatLP } from "../../commons/utils/functions/formatPrice";
import { ModalSubmit } from "../LoyaltyPointComp/ModalSubmit";
import { STATUS_CODE } from "../Notification/Notification";
import "./index.scss";
import styles from "./lp-cashout.module.scss";

interface DataType {
  key: React.Key;
  name: string;
  id: number;
  quantity: number;
  total_sales: number;
  price: number;
  images: string[];
  isFeatured: boolean;
}

export enum LPCashoutRequestStatus {
  CREATED = 0,
  APPROVED = 1,
  REJECTED = 2,
  RECEIVED = 3,
  CANCELLED = 4,
}

const LPCashOut: React.FC = () => {
  const navigate = useNavigate();
  const [, setKeyword] = useState("");
  const [form] = Form.useForm<{}>();
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
  const [openModal, setOpenModal] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<any>({});
  const [amount, setAmount] = useState("0");
  const [dataPoint, setDataPoint] = useState<any>({});
  const [id, setId] = useState(0);
  const [openModalSubmit, setOpenModalSubmit] = useState(false);
  const [openModalSubmit2, setOpenModalSubmit2] = useState(false);
  const [id2, setId2] = useState(0);

  const amountToSingaporeDollar = useMemo(() => {
    return new BigNumber(amount).multipliedBy(exchangeRate?.sgd_rate).div(exchangeRate?.lp_rate).toFixed(2, 1);
  }, [amount, exchangeRate?.sgd_rate, exchangeRate?.lp_rate]);

  const fetchListCashOut = async () => {
    try {
      setLoading(true);
      const res = await defaultAxios.get(LP_CASH_OUT_LIST, { params });
      if (res.data?.items && res.status === STATUS_CODE.SUCCESS) {
        setDataSrc(res.data?.items);
      }
      if (res.data.headers && res.status === STATUS_CODE.SUCCESS) {
        setMetadata(res.data.headers);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getExchangeRate = async () => {
    try {
      const res = await defaultAxios.get(LP_RATE);
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setExchangeRate(res.data);
      }
    } catch (error) {}
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
    fetchListCashOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    getExchangeRate();
  }, []);

  useEffect(() => {
    getCurrentPoint();
  }, []);

  const getStatus = (status: number) => {
    if (status === LPCashoutRequestStatus.CREATED) {
      return "Created";
    } else if (status === LPCashoutRequestStatus.APPROVED) {
      return "Approved";
    } else if (status === LPCashoutRequestStatus.REJECTED) {
      return "Rejected";
    } else {
      return "Received";
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "no",
      render: (text, record, index) => {
        return params.page === 1 ? index + 1 : (params.page - 1) * params.perPage + (index + 1);
      },
    },
    {
      title: "Request ID",
      dataIndex: "id",
    },
    {
      title: "LP Cash out",
      dataIndex: "lp_amount",
      render: (text: string) => formatLP(text),
    },
    {
      title: "Cash out amount",
      dataIndex: "lp_amount",
      render: (text, record) => {
        const result = (Number(text) * exchangeRate.sgd_rate) / exchangeRate.lp_rate;
        return <div>S$ {format2Digit(result)}</div>;
      },
    },
    {
      title: "Requested D&T",
      dataIndex: "request_date",
      render: (text, record) => {
        return <div>{dayjs(text).format("DD/MM/YYYY HH:mm")}</div>;
      },
    },
    {
      title: "Payment D&T",
      dataIndex: "paid_date",
      render: (text, record) => {
        return <div>{dayjs(text).isValid() && dayjs(text).format("DD/MM/YYYY HH:mm")}</div>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return <div>{getStatus(text)}</div>;
      },
    },
    {
      width: 150,
      title: "Action",
      align: "center",
      key: "action",
      render: (row: Product, record: any) => {
        const { status } = record;
        const isEnable = status === LPCashoutRequestStatus.APPROVED;
        return (
          <PrimaryButton
            className={styles.receivedBtn}
            onClick={() => {
              handleRecived(record?.id);
            }}
            disabled={!isEnable}
          >
            Received
          </PrimaryButton>
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

  const handleCancel = () => {
    setOpenModal(false);
    setOpenModalBuyMore(false);
    form.resetFields();
    setAmount("0");
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
        await fetchListCashOut();
      } else {
        throw response;
      }
    } catch (error) {
      message.error(get(error, "response.data.error.message", "LP Cash out quantity fail!"));
    } finally {
      setLoading(false);
    }
  };

  const handleRecived = async (id: string | number) => {
    try {
      setLoading(true);
      const response = await defaultAxios.put(LP_RECEIVED(id));
      if (response.status >= 200 && response.status < 400) {
        setOpenModal(false);
        message.success("Received successfuly!");
        await fetchListCashOut();
      } else {
        throw response;
      }
    } catch (error) {
      message.error("Received fail!");
    } finally {
      setLoading(false);
    }
  };

  const search = debounce(e => {
    const value = e.target.value;
    setParams({
      ...params,
      page: 1,
      request_id: value,
    });
  }, 500);

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
      message.error("Buy more fail!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>LP Cash Out Requests</div>
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
      <div className={styles.currentPoint} style={{ marginTop: 40 }}>
        Current Loyalty Points: <span>{formatLP(dataPoint?.total_point || 0)}</span>{" "}
      </div>
      <div className={styles.title}>Request list</div>
      <CustomInput
        onChange={event => search(event)}
        onBlur={event => setKeyword(event.target.value.trim())}
        className={styles.inputSearch}
        type="search"
        placeholder="Search for Request ID"
      />
      <div className={styles.productPanel}>
        <div style={{ float: "right", marginBottom: 20 }}>
          <CustomPagination
            current={params.page}
            showSizeChanger
            onChange={handleChangePagination}
            total={metadata["x-total-count"]}
          />
        </div>
        <CustomTable pagination={false} columns={columns} dataSource={dataSrc} />
      </div>

      <CustomModal maskClosable={false} footer={<></>} title="LP Cash Out" open={openModal} onCancel={handleCancel}>
        <Form id="update-stock" form={form} onFinish={handleCashOut} style={{ marginTop: 32 }}>
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

      {openModalBuyMore && (
        <CustomModal
          maskClosable={false}
          footer={<></>}
          title="Buy LP Request"
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

export default LPCashOut;
