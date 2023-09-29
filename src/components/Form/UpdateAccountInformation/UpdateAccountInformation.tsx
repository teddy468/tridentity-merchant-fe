import { Button, Form, message } from "antd";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import styles from "../../../components/AccountInformation/AccountInformation.module.scss";
import { AccountInformationFormFields } from "../../../commons/constants/formField";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import { filterECharacterInputNumber, integerOnlyInput } from "../../../commons/utils/functions/integerOnly";
import removeExtraSpace from "../../../commons/utils/functions/removeExtraSpace";
// import { getErroFnc } from "../../../commons/utils/functions/helper";
import { STATUS_CODE } from "../../Notification/Notification";
import defaultAxios from "../../../commons/utils/axios";
import FormHeader from "../../../commons/components/FormHeader/FormHeader";
import PrimaryButton from "../../../commons/components/PrimaryButton/PrimaryButton";
import GradientText from "../../../commons/components/GradientText/GradientText";
import CustomPhoneInput from "../../../commons/components/CustomPhoneInput/CustomPhoneInput";
import { getCurrentPattern } from "../../../commons/constants";
import { PREFIXES, objecFieldsRejected } from "../../../commons/constants/user";
import { CustomSelect } from "../../../commons/components/CustomSelect/CustomSelect";
import {
  CATEGORIES_URL,
  MERCHANT_ACOUNT_INFORMATION,
  MERCHANT_REQUEST_UPDATE_ACCOUNT_INFORMATION,
} from "../../../commons/constants/api-urls";
import ConfirmPopup from "../../../commons/components/ConfirmPopup/ConfirmPopup";
import { useNavigate } from "react-router-dom";

const UpdateAccountInformation = () => {
  const navigate = useNavigate();
  const [statusUpdate, setStatusUpdate] = useState();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [form] = Form.useForm<AccountInformationForm>();

  async function handleUpdateAccountInformation(body: UpdateAccountInformationBody) {
    setLoading(true);
    try {
      await defaultAxios.put(MERCHANT_REQUEST_UPDATE_ACCOUNT_INFORMATION(), body);
      message.success("Send Request Update successfully");
      navigate("/account-information");
    } catch (error) {
      console.log(error);
      message.error("Send Request Update failed");
    } finally {
      setLoading(false);
    }
  }
  function onFinish(value: AccountInformationForm) {
    setOpenConfirmPopup(true);
  }
  function submitChange(values: AccountInformationForm) {
    setOpenConfirmPopup(false);
    const body: UpdateAccountInformationBody = {
      ...values,
      name: values.company_name,
      settings: {
        is_highlight: true,
      },
      phone: `${values.region}${values.phone}`,
      phoneCode: values.region.replace("+", ""),
      documents: ["values.documents"],
      logo: "values.logo",
      banner: [" values.banner"],
      merchantContact: {
        registeredOfficeAddress: values.registeredOfficeAddress,
        sfaNumber: values.sfaNumber,
        gstRegistrationNumber: values.gstRegistrationNumber,
        representativeName: values.representativeName,
        contactOfficeNo: values.contactOfficeNo,
        contactEmailAddress: values.contactEmailAddress,
        territory: values.territory,
        businessNature: values.businessNature,
        contactMobileNo: values.contactMobileNo,
      },
      merchantBankDetail: {
        financeRepresentativeName: values.financeRepresentativeName,
        bankOfficeNo: values.bankOfficeNo,
        bankMobileNo: values.bankMobileNo,
        bankEmailAddress: values.bankEmailAddress,
        bankName: values.bankName,
        accountNo: values.accountNo,
        accountName: values.accountName,
      },
    };
    handleUpdateAccountInformation(body);
  }
  function handleCancel() {
    navigate("/account-information");
  }

  const getUserInfo = async () => {
    try {
      const res = await defaultAxios.get(MERCHANT_ACOUNT_INFORMATION());
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setData(res.data);
        setStatusUpdate(res.data.information.merchantApprovals.status);
      }
    } catch (error) {}
  };

  const region = Form.useWatch("region", form);
  const phonePattern = useMemo(() => getCurrentPattern(region), [region]);

  const AcountInformation = () => {
    return (
      <>
        <h2 className={styles.infoTitle}>Account Information</h2>
        <div className={styles.detail}>
          <div className={styles.column}>
            {AccountInformationFormFields.slice(0, 2).map((field, idx) => {
              if (field.type === "number") {
                return (
                  <CustomInput
                    className={styles.input}
                    key={idx}
                    label={field.title}
                    type={field.type}
                    onKeyDown={event => {
                      integerOnlyInput(event);
                    }}
                    onChange={e => {
                      filterECharacterInputNumber(field.name, form, e);
                    }}
                    maxLength={100}
                    rules={field.rule}
                    placeholder={field.placeholder}
                    name={field.name}
                    onBlur={removeExtraSpace(field.name, form)}
                    style={{ marginBottom: "0px" }}
                  />
                );
              } else {
                return (
                  <CustomInput
                    className={styles.input}
                    key={idx}
                    label={field.title}
                    type={field.type}
                    maxLength={100}
                    rules={field.rule}
                    placeholder={field.placeholder}
                    name={field.name}
                    onBlur={removeExtraSpace(field.name, form)}
                    style={{ marginBottom: "0px" }}
                  />
                );
              }
            })}
          </div>
          <div className={[styles.column, styles.secondColumn].join(" ")}>
            {AccountInformationFormFields.slice(2, 4).map(field => {
              if (field.name === "phone") {
                return (
                  <Fragment key={field.name}>
                    <CustomPhoneInput
                      className={styles.input}
                      label={field.title}
                      formInstance={form}
                      placeholder="Phone number"
                      name={"phone"}
                      rules={[
                        {
                          required: true,
                          message: "This field is required",
                        },
                        {
                          pattern: phonePattern,
                          message: "Invalid phone number",
                        },
                      ]}
                    />
                  </Fragment>
                );
              }
              // if (field.name === "category_ids") {
              //   return (
              //     <CustomSelect
              //       onChange={() => {
              //         // getErroFnc(form.getFieldsError(), setIsInvalidFields);
              //       }}
              //       onMouseLeave={() => {
              //         // getErroFnc(form.getFieldsError(), setIsInvalidFields);
              //       }}
              //       rules={[{ required: true, message: "This field is required" }]}
              //       placeholder="Choose business categories"
              //       name="category_ids"
              //       options={options}
              //       // defaultValue={options?.[0]?.value}
              //       mode="multiple"
              //       allowClear
              //       label={field.title}
              //       className={styles.input}
              //     />
              //   );
              // }
            })}
          </div>
        </div>
      </>
    );
  };

  const MerchantInformation = () => {
    return (
      <>
        <h2 className={styles.infoTitle}>Merchant Information</h2>
        <div className={styles.detail}>
          <div className={styles.column}>
            {AccountInformationFormFields.slice(4, 9).map((field, idx) => {
              if (field.type === "number") {
                return (
                  <CustomInput
                    className={styles.input}
                    label={field.title}
                    key={idx}
                    type={field.type}
                    onKeyDown={event => {
                      integerOnlyInput(event);
                    }}
                    onChange={e => {
                      filterECharacterInputNumber(field.name, form, e);
                    }}
                    onMouseLeave={() => {}}
                    maxLength={100}
                    rules={field.rule}
                    placeholder={field.placeholder}
                    name={field.name}
                    onBlur={removeExtraSpace(field.name, form)}
                    style={{ marginBottom: "0px" }}
                  />
                );
              } else {
                return (
                  <CustomInput
                    key={idx}
                    className={styles.input}
                    label={field.title}
                    type={field.type}
                    maxLength={100}
                    rules={field.rule}
                    placeholder={field.placeholder}
                    name={field.name}
                    onBlur={removeExtraSpace(field.name, form)}
                    style={{ marginBottom: "0px" }}
                  />
                );
              }
            })}
          </div>
          <div className={[styles.column, styles.secondColumn].join(" ")}>
            {AccountInformationFormFields.slice(9, 13).map((field, idx) => {
              if (field.type === "number") {
                return (
                  <CustomInput
                    className={styles.input}
                    key={idx}
                    label={field.title}
                    type={field.type}
                    onKeyDown={event => {
                      integerOnlyInput(event);
                    }}
                    onChange={e => {
                      filterECharacterInputNumber(field.name, form, e);
                    }}
                    maxLength={100}
                    rules={field.rule}
                    placeholder={field.placeholder}
                    name={field.name}
                    onBlur={removeExtraSpace(field.name, form)}
                    style={{ marginBottom: "0px" }}
                  />
                );
              } else {
                return (
                  <CustomInput
                    className={styles.input}
                    key={idx}
                    label={field.title}
                    type={field.type}
                    maxLength={100}
                    rules={field.rule}
                    placeholder={field.placeholder}
                    name={field.name}
                    onBlur={removeExtraSpace(field.name, form)}
                    style={{ marginBottom: "0px" }}
                  />
                );
              }
            })}
          </div>
        </div>
      </>
    );
  };

  const PaymentDetail = () => {
    return (
      <>
        <h2 className={styles.infoTitle}>Payment Information</h2>
        <div className={styles.detail}>
          <div className={styles.column}>
            {AccountInformationFormFields.slice(13, 17).map((field, idx) => {
              if (field.type === "number") {
                return (
                  <CustomInput
                    className={styles.input}
                    label={field.title}
                    key={idx}
                    type={field.type}
                    onKeyDown={event => {
                      integerOnlyInput(event);
                    }}
                    onChange={e => {
                      filterECharacterInputNumber(field.name, form, e);
                    }}
                    maxLength={100}
                    rules={field.rule}
                    placeholder={field.placeholder}
                    name={field.name}
                    onBlur={removeExtraSpace(field.name, form)}
                    style={{ marginBottom: "0px" }}
                  />
                );
              } else {
                return (
                  <CustomInput
                    className={styles.input}
                    label={field.title}
                    key={idx}
                    type={field.type}
                    maxLength={100}
                    rules={field.rule}
                    placeholder={field.placeholder}
                    name={field.name}
                    onBlur={removeExtraSpace(field.name, form)}
                    style={{ marginBottom: "0px" }}
                  />
                );
              }
            })}
          </div>
          <div className={[styles.column, styles.secondColumn].join(" ")}>
            {AccountInformationFormFields.slice(17).map((field, idx) => {
              if (field.type === "number") {
                return (
                  <CustomInput
                    className={styles.input}
                    label={field.title}
                    key={idx}
                    type={field.type}
                    onKeyDown={event => {
                      integerOnlyInput(event);
                    }}
                    onChange={e => {
                      filterECharacterInputNumber(field.name, form, e);
                    }}
                    maxLength={100}
                    rules={field.rule}
                    placeholder={field.placeholder}
                    name={field.name}
                    onBlur={removeExtraSpace(field.name, form)}
                    style={{ marginBottom: "0px" }}
                  />
                );
              } else {
                return (
                  <CustomInput
                    className={styles.input}
                    key={idx}
                    label={field.title}
                    type={field.type}
                    onChange={e => {
                      // getErroFnc(form.getFieldsError(), setIsInvalidFields);
                    }}
                    onMouseLeave={() => {
                      // getErroFnc(form.getFieldsError(), setIsInvalidFields);
                    }}
                    maxLength={100}
                    rules={field.rule}
                    placeholder={field.placeholder}
                    name={field.name}
                    onBlur={removeExtraSpace(field.name, form)}
                    style={{ marginBottom: "0px" }}
                  />
                );
              }
            })}
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    getUserInfo();
    // getCategories();
  }, []);
  useEffect(() => {
    if (data?.information?.merchantApprovals) {
      // set form error for invalid fields
      form.setFieldsValue({
        documents: data.information.merchantApprovals.documents,
        company_name: data.information.merchantApprovals.name,
        email: data.information.merchantApprovals.email,
        phone: Number(data.information.merchantApprovals.phone.replace("+65", "").replace("+84", "")),
        registeredOfficeAddress: data.information.merchantApprovals.registeredOfficeAddress,
        sfaNumber: data.information.merchantApprovals.sfaNumber,
        gstRegistrationNumber: data.information.merchantApprovals.gstRegistrationNumber,
        representativeName: data.information.merchantApprovals.representativeName,
        contactOfficeNo: data.information.merchantApprovals.contactOfficeNo,
        territory: data.information.merchantApprovals.territory,
        businessNature: data.information.merchantApprovals.businessNature,
        contactEmailAddress: data.information.merchantApprovals.contactEmailAddress,
        contactMobileNo: data.information.merchantApprovals.contactMobileNo,
        financeRepresentativeName: data.information.merchantApprovals.financeRepresentativeName,
        bankOfficeNo: data.information.merchantApprovals.bankOfficeNo,
        bankMobileNo: data.information.merchantApprovals.bankMobileNo,
        bankEmailAddress: data.information.merchantApprovals.bankEmailAddress,
        bankName: data.information.merchantApprovals.bankName,
        accountNo: data.information.merchantApprovals.accountNo,
        accountName: data.information.merchantApprovals.accountName,
        region: data.information.merchantApprovals.phone.slice(0, 3),
      });
      if (data.information.merchantApprovals.rejectedFields?.length > 0)
        form.setFields(
          data.information.merchantApprovals.rejectedFields.map((key: string) => ({
            name: objecFieldsRejected[key as keyof typeof objecFieldsRejected],
            errors: [""],
          }))
        );

      return;
    }
    if (data) {
      form.setFieldsValue({
        documents: data.information.documents,
        company_name: data.information.name,
        email: data.information.merchantUser.email,
        phone: Number(data.information.merchantUser.phone.replace("+65", "").replace("+84", "")),
        registeredOfficeAddress: data.information.merchantContact.registeredOfficeAddress,
        sfaNumber: data.information.merchantContact.sfaNumber,
        gstRegistrationNumber: data.information.merchantContact.gstRegistrationNumber,
        representativeName: data.information.merchantContact.representativeName,
        contactOfficeNo: data.information.merchantContact.officeNo,
        territory: data.information.merchantContact.territory,
        businessNature: data.information.merchantContact.businessNature,
        contactEmailAddress: data.information.merchantContact.emailAddress,
        contactMobileNo: data.information.merchantContact.mobileNo,
        financeRepresentativeName: data.information.merchantBankDetail.financeRepresentativeName,
        bankOfficeNo: data.information.merchantBankDetail.officeNo,
        bankMobileNo: data.information.merchantBankDetail.mobileNo,
        bankEmailAddress: data.information.merchantBankDetail.emailAddress,
        bankName: data.information.merchantBankDetail.bankName,
        accountNo: data.information.merchantBankDetail.accountNo,
        accountName: data.information.merchantBankDetail.accountName,
        region: data.information.merchantUser.phone.slice(0, 3),
      });
    }
  }, [data]);

  return (
    <div className={styles.wrapper}>
      <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
        <FormHeader
          title={"Update Information"}
          actions={
            <>
              <Button type="text" className={styles.cancel} onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Form.Item noStyle shouldUpdate={() => true}>
                {() => {
                  return (
                    <PrimaryButton
                      onClick={() => form.submit()}
                      className={styles.save}
                      disabled={
                        loading ||
                        !!form.getFieldsError().find(item => item.errors.length) ||
                        statusUpdate === "PENDING"
                      }
                    >
                      {loading ? "Saving" : "Update"}
                    </PrimaryButton>
                  );
                }}
              </Form.Item>
            </>
          }
        />

        <div className={styles.panel}>
          <div className={styles.noteForUpdate}>
            <GradientText
              text="  Your changes will not be applied until they have been approved by an administrator. Please make sure to
            proofread your information carefully before submitting it."
            />
          </div>
          <AcountInformation />
          <MerchantInformation />
          <PaymentDetail />
        </div>
      </Form>

      <ConfirmPopup
        open={openConfirmPopup}
        onCancel={() => {
          submitChange(form.getFieldsValue());

          setOpenConfirmPopup(false);
        }}
        title="Update Information"
        description={`Are you sure want to update your information? We will notify you once your account has been approved.`}
        onConfirm={() => {
          submitChange(form.getFieldsValue());
        }}
      />
    </div>
  );
};

export default UpdateAccountInformation;
