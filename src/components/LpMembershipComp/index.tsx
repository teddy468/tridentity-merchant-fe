import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Col, Collapse, message, Row } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import CustomModal from "../../commons/components/CustomModal/CustomModal";
import CustomTabs from "../../commons/components/CustomTabs";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import {
  COLLECTIONS,
  MEMBERSHIP,
  PARAMS_MERCHANT,
  PARAMS_PLATFORM_FEE,
  REQUEST_UPDATE,
} from "../../commons/constants/api-urls";
import { TrifoodLogo } from "../../commons/resources";
import defaultAxios from "../../commons/utils/axios";
import { STATUS_CODE } from "../Notification/Notification";
import "../OrderTracking/styles.scss";
import styles from "./lp-membership.module.scss";

const { Panel } = Collapse;

enum LEVEL_MEMBERSHIP {
  Standard,
  Premium,
  Elite,
  Platinum,
}

const LpMembershipComp: React.FC = () => {
  const [activeTab, setActiveTab] = useState(LEVEL_MEMBERSHIP.Standard.toString());
  const [openModal, setOpenModal] = useState(false);
  const [member, setMember] = useState<any>({});
  const [collections, setCollections] = useState([]);
  const [paramsConfig, setParamsConfig] = useState([]);
  const [platFormFee, setPlatFormFee] = useState(0);

  useEffect(() => {
    if (member?.level > -1) {
      setActiveTab(String(member?.level));
    }
  }, [member?.level]);

  useEffect(() => {
    getMemberShip();
  }, []);

  useEffect(() => {
    getCollections();
  }, []);

  useEffect(() => {
    getParamsConfig();
  }, []);

  const getParamsConfig = async () => {
    try {
      const res = await defaultAxios.get(PARAMS_MERCHANT);
      const currentPlatFormFee = await defaultAxios.get(PARAMS_PLATFORM_FEE);
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setParamsConfig(res.data);
      }
      if (currentPlatFormFee.data && currentPlatFormFee.status === STATUS_CODE.SUCCESS) {
        setPlatFormFee(currentPlatFormFee.data.percent);
      }
    } catch (error) {}
  };

  const fee = useMemo(() => {
    const result = paramsConfig.find((item: any) => item?.tier === activeTab) as any;
    return platFormFee - result?.data?.platform_fee_discount;
  }, [activeTab, paramsConfig, platFormFee]);

  const getUrlByLevel = (level: number) => {
    switch (level) {
      case LEVEL_MEMBERSHIP.Standard:
        return "bronze.png";
      case LEVEL_MEMBERSHIP.Premium:
        return "silver.png";
      case LEVEL_MEMBERSHIP.Elite:
        return "gold.png";
      case LEVEL_MEMBERSHIP.Platinum:
        return "diamond.png";
      default:
        return "bronze.png";
    }
  };

  const cardUrl = useMemo(() => {
    switch (member?.level) {
      case LEVEL_MEMBERSHIP.Standard:
        return "standard.png";
      case LEVEL_MEMBERSHIP.Premium:
        return "premium.png";
      case LEVEL_MEMBERSHIP.Elite:
        return "platinum.png";
      case LEVEL_MEMBERSHIP.Platinum:
        return "elite.png";
      default:
        return "standard.png";
    }
  }, [member?.level]);

  const getCollections = async () => {
    try {
      const res = await defaultAxios.get(COLLECTIONS);
      if (res.status === STATUS_CODE.SUCCESS && res.data) {
        setCollections(res.data);
      }
    } catch (error) {}
  };

  const getMemberShip = async () => {
    try {
      const res = await defaultAxios.get(MEMBERSHIP);
      console.log(res);
      if (res.status === STATUS_CODE.SUCCESS && res.data) {
        setMember(res.data);
      }
    } catch (error) {}
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleUpgrade = async () => {
    try {
      const res = await defaultAxios.get(REQUEST_UPDATE);
      if (res.status >= 200 && res.status < 400) {
        message.success("Request successful!");
      }
    } catch (error) {
      message.error(get(error, "response.data.error.message", "Request fail!"));
    } finally {
      setOpenModal(false);
    }
  };

  const Tabs = [
    {
      title: "Standard",
      key: LEVEL_MEMBERSHIP.Standard.toString(),
    },

    {
      title: "Premium",
      key: LEVEL_MEMBERSHIP.Premium.toString(),
    },
    {
      title: "Elite",
      key: LEVEL_MEMBERSHIP.Elite.toString(),
    },

    {
      title: "Platinum",
      key: LEVEL_MEMBERSHIP.Platinum.toString(),
    },
  ];

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>{`LP & Membership`}</div>
          <PrimaryButton className={styles.addProductBtn} onClick={() => setOpenModal(true)}>
            Request Membership Upgrade
          </PrimaryButton>
        </div>
        <div className={styles.productPanel}>
          <Row>
            <Col span={10} className={styles.wrapper}>
              <img className={styles.card} src={`/images/membership-cards/${cardUrl}`} alt="card" />
              <div className={styles.information}>
                <div className={styles.name}>{member?.merchant?.name}</div>
                <div className={styles.membership}>Membership ID:</div>
                <div className={styles.id}>{member?.token_id}</div>
                <div className={styles.membership}>Issue Date</div>
                <div className={styles.id}>
                  {dayjs(member?.active_date).isValid() && dayjs(member?.active_date).format("DD/MM/YYYY")}
                </div>
              </div>
            </Col>
            <Col span={7}></Col>
          </Row>
        </div>
        <div className={styles.membershipPerk}>
          <div className={styles.title}>Membership Perks</div>
          <CustomTabs
            tabStyle={styles.customTab}
            activeTab={activeTab}
            onChange={handleTabChange}
            tabs={Tabs}
            width={"100%"}
          >
            <></>
          </CustomTabs>
          <div className={styles.description}>
            <Row>
              <Col span={12}>
                <div className={styles.head}>Membership Perk</div>
                <ul className={styles.list}>
                  <li>{fee}% Platform fee</li>
                  <li>Applicable to any product on Tridentity Marketplace</li>
                  <li>Non - transferrable</li>
                </ul>
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles.productPanel}>
          <Collapse
            expandIconPosition="end"
            bordered={false}
            expandIcon={({ isActive }) => (!isActive ? <DownOutlined /> : <UpOutlined />)}
            defaultActiveKey={["0"]}
            style={{ backgroundColor: "#212124", padding: "24px 24px" }}
          >
            <Panel header={<div className="panel__prodName">Membership Collection</div>} key={`0`}>
              <Row>
                {collections.map((item: any) => {
                  return (
                    <>
                      <Col span={12} className={styles.wrapper} style={{ marginBottom: 32 }}>
                        <img
                          className={styles.card}
                          src={`/images/membership-cards/${getUrlByLevel(item?.level)}`}
                          alt="card"
                        />
                        <div className={styles.information}>
                          <div className={styles.name}>{member?.merchant?.name}</div>
                          <div className={styles.membership}>Membership ID:</div>
                          <div className={styles.id}>{item?.token_id}</div>
                          <div className={styles.membership}>Issue Date</div>
                          <div className={styles.id}>
                            {dayjs(item?.active_date).isValid() && dayjs(item?.active_date).format("DD/MM/YYYY")}
                          </div>
                        </div>
                      </Col>
                    </>
                  );
                })}
              </Row>
            </Panel>
          </Collapse>
        </div>
      </div>
      <CustomModal
        maskClosable={true}
        footer={
          <PrimaryButton className={styles.addProductBtn} onClick={handleUpgrade}>
            OK
          </PrimaryButton>
        }
        open={openModal}
        onCancel={() => setOpenModal(false)}
      >
        <div className={styles.logoWrapper}>
          <TrifoodLogo />
        </div>
        <div className={styles.modalTitle}>REQUEST RECEIVED</div>
        <div className={styles.modal}>
          <div className={styles.body}>
            Your request has been sent to Tridentity Support Center! We will respond to you as soon as possible!
          </div>
          <div className={styles.requestId}>Request ID : {member?.merchant_id}</div>
        </div>
      </CustomModal>
    </>
  );
};

export default LpMembershipComp;
