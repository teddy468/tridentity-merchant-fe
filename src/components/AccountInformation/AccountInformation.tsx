import _ from "lodash";
import { last } from "lodash";
import { useEffect, useMemo, useState } from "react";
import GradientText from "../../commons/components/GradientText/GradientText";
import { DocumentTextIcon, MoneyReceiveIcon } from "../../commons/resources";
import defaultAxios from "../../commons/utils/axios";
import { format2Digit, formatLP } from "../../commons/utils/functions/formatPrice";
import { STATUS_CODE } from "../Notification/Notification";
import styles from "./AccountInformation.module.scss";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { routers } from "../../commons/constants/routers";
import { RejectedFieldUpdate } from "../../commons/constants/user";
import VerifyIcon from "../../assets/icons/VerifyIcon.svg";
import RejectIcon from "../../assets/icons/RejectIcon.svg";
import PendingIcon from "../../assets/icons/PendingYellowIcon.svg";
import { MERCHANT_ACOUNT_INFORMATION } from "../../commons/constants/api-urls";

export const formatPhoneNumber = (text: string) => {
  return text?.replace("+65", "(65) ");
};

const AccountInformation: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("Pending");
  const [data, setData] = useState<any>();
  useEffect(() => {
    getUserInfo();
  }, []);

  const list = data?.information?.merchantApprovals
    ? data?.information?.merchantApprovals?.categories?.map((item: any) => item.name)
    : data?.information?.categories?.map((item: any) => item.name);

  const getUserInfo = async () => {
    try {
      const res = await defaultAxios.get(MERCHANT_ACOUNT_INFORMATION());
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setData(res.data);
        if (!res.data.information.merchantApprovals) {
          setStatus("ACCEPTED");
        } else if (res.data.information.merchantApprovals.status === "PENDING") {
          setStatus("PENDING");
        } else {
          setStatus("REJECTED");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAccountInformation = useMemo(() => {
    if (!data)
      return {
        arrayAccountInformation: [],
        arrayMerchantInformation: [],
        arrayPaymentDetails: [],
      };
    //case update rejected
    if (data.information.merchantApprovals) {
      return {
        arrayAccountInformation: [
          {
            title: "Full name",
            value: data?.information?.merchantApprovals?.name,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(RejectedFieldUpdate.NAME),
          },
          {
            title: "Email",
            value: data?.information?.merchantApprovals?.email,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(RejectedFieldUpdate.EMAIL),
          },
          {
            title: "Phone number",
            value: formatPhoneNumber(data?.information?.merchantApprovals?.phone),
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(RejectedFieldUpdate.PHONE),
          },
          {
            title: "Category",
            value: list?.length > 0 && _.join(list, `, `),
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(RejectedFieldUpdate.CATEGORY),
          },
        ],
        arrayMerchantInformation: [
          {
            title: "Registered Office Address",
            value: data?.information?.merchantApprovals?.registeredOfficeAddress,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(
              RejectedFieldUpdate.REGISTERED_OFFICE_ADDRESS
            ),
          },
          {
            title: "SFA Number",
            value: data?.information?.merchantApprovals?.sfaNumber,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(RejectedFieldUpdate.SFA_NUMBER),
          },
          {
            title: "GST Registration Number",
            value: data?.information?.merchantApprovals?.gstRegistrationNumber,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(
              RejectedFieldUpdate.GST_REGISTRATION_NUMBER
            ),
          },
          {
            title: "Representative Name",
            value: data?.information?.merchantApprovals?.representativeName,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(
              RejectedFieldUpdate.REPRESENTATIVE_NAME
            ),
          },
          {
            title: "Office No",
            value: data?.information?.merchantApprovals?.officeNo,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(
              RejectedFieldUpdate.CONTACT_OFFICE_NO
            ),
          },
          {
            title: "Territory",
            value: data?.information?.merchantApprovals?.territory,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(RejectedFieldUpdate.TERRITORY),
          },
          {
            title: "Business Nature",
            value: data?.information?.merchantApprovals?.businessNature,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(
              RejectedFieldUpdate.BUSINESS_NATURE
            ),
          },
          {
            title: "Email address",
            value: data?.information?.merchantApprovals?.emailAddress,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(
              RejectedFieldUpdate.CONTACT_EMAIL_ADDRESS
            ),
          },
          {
            title: "Mobile No",
            value: data?.information?.merchantApprovals?.mobileNo,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(
              RejectedFieldUpdate.CONTACT_MOBILE_NO
            ),
          },
        ],
        arrayPaymentDetails: [
          {
            title: "Finance Representative Name",
            value: data?.information?.merchantApprovals?.financeRepresentativeName,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(
              RejectedFieldUpdate.FINANCE_REPRESENTATIVE_NAME
            ),
          },
          {
            title: "Office No",
            value: data?.information?.merchantApprovals?.officeNo,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(
              RejectedFieldUpdate.BANK_OFFICE_NO
            ),
          },
          {
            title: "Mobile No",
            value: data?.information?.merchantApprovals?.mobileNo,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(
              RejectedFieldUpdate.BANK_MOBILE_NO
            ),
          },
          {
            title: "Email Address",
            value: data?.information?.merchantApprovals?.emailAddress,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(
              RejectedFieldUpdate.BANK_EMAIL_ADDRESS
            ),
          },
          {
            title: "Bank Name",
            value: data?.information?.merchantApprovals?.bankName,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(RejectedFieldUpdate.BANK_NAME),
          },
          {
            title: "Account Number",
            value: data?.information?.merchantApprovals?.accountNo,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(RejectedFieldUpdate.ACCOUNT_NO),
          },
          {
            title: "Acount Name",
            value: data?.information?.merchantApprovals?.accountName,
            isReject: data?.information?.merchantApprovals?.rejectedFields?.includes(RejectedFieldUpdate.ACCOUNT_NO),
          },
        ],
      };
    } else {
      return {
        arrayAccountInformation: [
          {
            title: "Full name",
            value: data?.information?.name,
            isReject: false,
          },
          {
            title: "Email",
            value: data?.information?.merchantUser?.email,
            isReject: false,
          },
          {
            title: "Phone number",
            value: formatPhoneNumber(data?.information?.merchantUser?.phone),
            isReject: false,
          },
          {
            title: "Category",
            value: list?.length > 0 && _.join(list, `, `),
            isReject: false,
          },
        ],
        arrayMerchantInformation: [
          {
            title: "Registered Office Address",
            value: data?.information?.merchantContact?.registeredOfficeAddress,
            isReject: false,
          },
          {
            title: "SFA Number",
            value: data?.information?.merchantContact?.sfaNumber,
            isReject: false,
          },
          {
            title: "GST Registration Number",
            value: data?.information?.merchantContact?.gstRegistrationNumber,
            isReject: false,
          },
          {
            title: "Representative Name",
            value: data?.information?.merchantContact?.representativeName,
            isReject: false,
          },
          {
            title: "Office No",
            value: data?.information?.merchantContact?.officeNo,
            isReject: false,
          },
          {
            title: "Territory",
            value: data?.information?.merchantContact?.territory,
            isReject: false,
          },
          {
            title: "Business Nature",
            value: data?.information?.merchantContact?.businessNature,
            isReject: false,
          },
          {
            title: "Email address",
            value: data?.information?.merchantContact?.emailAddress,
            isReject: false,
          },
          {
            title: "Mobile No",
            value: data?.information?.merchantContact?.mobileNo,
            isReject: false,
          },
        ],
        arrayPaymentDetails: [
          {
            title: "Finance Representative Name",
            value: data?.information?.merchantBankDetail?.financeRepresentativeName,
            isReject: false,
          },
          {
            title: "Office No",
            value: data?.information?.merchantBankDetail?.officeNo,
            isReject: false,
          },
          {
            title: "Mobile No",
            value: data?.information?.merchantBankDetail?.mobileNo,
            isReject: false,
          },
          {
            title: "Email Address",
            value: data?.information?.merchantBankDetail?.emailAddress,
            isReject: false,
          },
          {
            title: "Bank Name",
            value: data?.information?.merchantBankDetail?.bankName,
            isReject: false,
          },
          {
            title: "Account Number",
            value: data?.information?.merchantBankDetail?.accountNo,
            isReject: false,
          },
          {
            title: "Acount Name",
            value: data?.information?.merchantBankDetail?.accountName,
            isReject: false,
          },
        ],
      };
    }
  }, [data]);

  return (
    <div className={styles.wrapper}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className={styles.title}>Account information</div>
        <div style={{ width: "200px" }}>
          <PrimaryButton
            children={
              <span
                onClick={() => {
                  navigate(routers.UPDATE_ACCOUNT_INFORMATION);
                }}
              >
                Update Information
              </span>
            }
          />
        </div>
      </div>

      <div className={styles.panel}>
        {status === "PENDING" && (
          <div className={styles.accountStatus}>
            <img src={PendingIcon} alt="icon" />
            <GradientText text={"Your account is in the process of being approved"} />
          </div>
        )}
        {status === "REJECTED" && (
          <div className={styles.accountStatus}>
            <img src={RejectIcon} alt="icon" />
            <p>
              Your updates could not be processed. Please correct the information within 72 hours or your update will be
              reset
            </p>
          </div>
        )}
        {status === "ACCEPTED" && (
          <div className={styles.accountStatus}>
            <img src={VerifyIcon} alt="icon" />
            <p className={styles.verified}>Your account have been verified.</p>
          </div>
        )}
        <div className={styles.summary}>
          <div className={styles.iconWRapper}>
            <MoneyReceiveIcon />
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Total Revenue</div>
            <div className={styles.row}>
              <div className={styles.name}>
                <GradientText text="TOTAL FIAT:" />
              </div>
              <div className={styles.value}>
                <GradientText text={`S$ ${format2Digit(data?.reports?.total_revenue)}`} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.name}>
                <GradientText text="TOTAL LP:" />
              </div>
              <div className={styles.value}>
                <GradientText text={`${formatLP(data?.reports?.total_received_lp)}`} />
              </div>
            </div>
          </div>
        </div>
        <h2 className={styles.infoTitle}>Account Information</h2>
        <div className={styles.detail}>
          <div className={styles.column}>
            {getAccountInformation.arrayAccountInformation.slice(0, 2).map((item, index) => {
              return (
                <div className={styles.row} key={index}>
                  <div className={styles.label}>{item.title}</div>
                  <div className={styles.value}>{item.value}</div>
                  {item.isReject && (
                    <div className={styles.rejectMessage}>The information you entered is not valid</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className={[styles.column, styles.secondColumn].join(" ")}>
            {getAccountInformation.arrayAccountInformation.slice(2).map((item, index) => {
              return (
                <div className={styles.row} key={index}>
                  <div className={styles.label}>{item.title}</div>
                  <div className={styles.value}>{item.value}</div>
                  {item.isReject && (
                    <div className={styles.rejectMessage}>The information you entered is not valid</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <h2 className={styles.infoTitle}>Merchant Information</h2>
        <div className={styles.detail}>
          <div className={styles.column}>
            {getAccountInformation.arrayMerchantInformation.slice(0, 5).map((item, index) => {
              return (
                <div className={styles.row} key={index}>
                  <div className={styles.label}>{item.title}</div>
                  <div className={styles.value}>{item.value}</div>
                  {item.isReject && (
                    <div className={styles.rejectMessage}>The information you entered is not valid</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className={[styles.column, styles.secondColumn].join(" ")}>
            {getAccountInformation.arrayMerchantInformation.slice(5).map((item, index) => {
              return (
                <div className={styles.row} key={index}>
                  <div className={styles.label}>{item.title}</div>
                  <div className={styles.value}>{item.value}</div>
                  {item.isReject && (
                    <div className={styles.rejectMessage}>The information you entered is not valid</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <h2 className={styles.infoTitle}>Payment Details</h2>
        <div className={styles.detail}>
          <div className={styles.column}>
            {getAccountInformation.arrayPaymentDetails.slice(0, 4).map((item, index) => {
              return (
                <div className={styles.row} key={index}>
                  <div className={styles.label}>{item.title}</div>
                  <div className={styles.value}>{item.value}</div>
                  {item.isReject && (
                    <div className={styles.rejectMessage}>The information you entered is not valid</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className={[styles.column, styles.secondColumn].join(" ")}>
            {getAccountInformation.arrayPaymentDetails.slice(4).map((item, index) => {
              return (
                <div className={styles.row} key={index}>
                  <div className={styles.label}>{item.title}</div>
                  <div className={styles.value}>{item.value}</div>
                  {item.isReject && (
                    <div className={styles.rejectMessage}>The information you entered is not valid</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.detail}>
          <div className={styles.column}>
            <div className={styles.row}>
              <div className={styles.label}>Documentation</div>
              {(data?.information?.documents as any[])?.length > 0
                ? (data?.information?.documents as any[]).map((item, index) => {
                    return (
                      <a key={index} href={item} target="_blank" rel="noreferrer">
                        <div className={styles.document} key={index}>
                          <DocumentTextIcon />
                          {last(item.split("/"))}
                        </div>
                        {item.isReject && (
                          <div className={styles.rejectMessage}>The information you entered is not valid</div>
                        )}
                      </a>
                    );
                  })
                : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
