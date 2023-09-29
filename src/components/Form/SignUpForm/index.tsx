import React, { useEffect, useMemo, useState } from "react";
import { Form } from "antd";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import styles from "./sign-up.module.scss";
import PrimaryButton from "../../../commons/components/PrimaryButton/PrimaryButton";
import { BriefCaseIcon, TrifoodLogo, SmsIcon, UserOctagonIcon } from "../../../commons/resources";
import { Link, useNavigate } from "react-router-dom";
import { routers } from "../../../commons/constants/routers";
import GradientText from "../../../commons/components/GradientText/GradientText";
import { CustomSelect } from "../../../commons/components/CustomSelect/CustomSelect";
import UploadFile from "../../../commons/components/UploadFile/UploadFile";
import CustomCheckbox from "../../../commons/components/CustomCheckbox/CustomCheckbox";
import { CATEGORIES_URL, MERCHANT_ONBOARD_REQUEST } from "../../../commons/constants/api-urls";
import defaultAxios, { uploadAxios } from "../../../commons/utils/axios";
import CustomModal from "../../../commons/components/CustomModal/CustomModal";
import CustomPhoneInput from "../../../commons/components/CustomPhoneInput/CustomPhoneInput";
import { AxiosError, AxiosResponse } from "axios";
import { PREFIXES } from "../../../commons/constants/user";
import { toast } from "react-toastify";
import get from "lodash/get";
import { COMPANY_NAME_PATTERN, EMAIL_PATTERN, getCurrentPattern } from "../../../commons/constants";
import { ArrowLeftOutlined } from "@ant-design/icons";
import removeExtraSpace from "../../../commons/utils/functions/removeExtraSpace";
import { filterECharacterInputNumber, integerOnlyInput } from "../../../commons/utils/functions/integerOnly";
import { AccountInformationFormFields } from "../../../commons/constants/formField";
import { getErroFnc } from "../../../commons/utils/functions/helper";

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<SignUpFormBody>();
  const [formStep2] = Form.useForm<SignUpFormBodyPart2>();
  const [formStep3] = Form.useForm<SignUpFormBodyPart3>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isInvalidFields, setIsInvalidFields] = useState(true);
  const isCompanyName = Form.useWatch("company_name", form);
  const isEmail = Form.useWatch("email", form);
  const isPhoneNumber = Form.useWatch("phone", form);
  const isDocument = Form.useWatch("documents", form);
  const isAgree = Form.useWatch("is_agree", form);
  const [signUpStep, setSignUpStep] = useState<number>(1);
  const [allStepDataSignUp, setAllStepDataSignUp] = useState<any>();

  const onFinish = async (values: SignUpFormBody) => {
    const body: any = {
      ...values,
      phone: values.region + values.phone,
      phoneCode: values.region.replace("+", ""),
    };
    setAllStepDataSignUp(body);
    handleChangeStep(true);
  };

  const onFinishStep2 = (values: SignUpFormBodyPart2) => {
    setAllStepDataSignUp((prev: any) => ({ ...prev, ...values }));
    handleChangeStep(true);
  };

  const onFinishStep3 = async (values: SignUpFormBodyPart3) => {
    const bodyAllStep = { ...allStepDataSignUp, ...values };
    try {
      const formData: any = new FormData();
      Object.keys(bodyAllStep).forEach(key => {
        if (key === "documents") {
          bodyAllStep[key].forEach((item: any) => {
            formData.append(key, item.originFileObj);
          });
        } else {
          formData.append(key, bodyAllStep[key as keyof any]);
        }
      });
      const res: AxiosResponse<MerchantOnboardRequestResponse> = await uploadAxios.post(
        MERCHANT_ONBOARD_REQUEST,
        formData
      );
      if (res?.data?.id) {
        setOpenModal(true);
        form.resetFields();
        form.setFieldValue("region", PREFIXES[0].value);
      } else {
        toast.error(get(res, "response.data.error.message", ""));
      }
    } catch (error) {
      console.log(error);
      const err = (error as AxiosError<any>)?.response?.data;
      const message =
        typeof err?.error.message === "string"
          ? err?.error.message
          : typeof err?.error.message?.[0] === "string"
          ? err.error.message[0]
          : "Register failed";
      toast.error(message);
    }
  };

  const region = Form.useWatch("region", form);

  const phonePattern = useMemo(() => getCurrentPattern(region), [region]);

  useEffect(() => {
    form.setFieldValue("region", PREFIXES[0].value);
  }, [form]);

  function handleChangeStep(isNext: boolean) {
    if (isNext) {
      setSignUpStep(prev => prev + 1);
    } else {
      setSignUpStep(prev => prev - 1);
    }
  }

  const SignUpStep1 = () => {
    return (
      <>
        <div className={styles.platform}>MERCHANT PLATFORM</div>
        <div className={styles.title}>Sign up</div>
        <div className={styles.inputWrapper}>
          <CustomInput
            onChange={() => {
              getErroFnc(form.getFieldsError(), setIsInvalidFields);
            }}
            onMouseLeave={() => {
              getErroFnc(form.getFieldsError(), setIsInvalidFields);
            }}
            rules={[
              {
                required: true,
                message: "This field is required",
                whitespace: true,
              },
              {
                pattern: COMPANY_NAME_PATTERN,
                message: "Invalid Company Name",
              },
            ]}
            placeholder="Company name"
            name="company_name"
            prefix={<UserOctagonIcon />}
          />
          <CustomInput
            onChange={() => {
              getErroFnc(form.getFieldsError(), setIsInvalidFields);
            }}
            onMouseLeave={() => {
              getErroFnc(form.getFieldsError(), setIsInvalidFields);
            }}
            rules={[
              {
                required: true,
                message: "This field is required",
                whitespace: true,
              },
              {
                pattern: EMAIL_PATTERN,
                message: "Invalid email",
              },
            ]}
            placeholder="Email address"
            name="email"
            prefix={<SmsIcon />}
            type="email"
          />
          <CustomPhoneInput
            formInstance={form}
            onChange={() => {
              getErroFnc(form.getFieldsError(), setIsInvalidFields);
            }}
            onMouseLeave={() => {
              getErroFnc(form.getFieldsError(), setIsInvalidFields);
            }}
            placeholder="Phone number"
            name="phone"
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

          <UploadFile
            onChange={() => {
              getErroFnc(form.getFieldsError(), setIsInvalidFields);
            }}
            rules={[{ required: true, message: "This field is required" }]}
            description={
              <p>
                Upload business document(s),
                <br /> accepted formats: .pdf, .jpg, .png, .doc, .docx, .pdf
              </p>
            }
            label={undefined}
            name="documents"
            multiple={true}
            maxCount={3}
            className={styles.uploadFile}
          />
        </div>
        <CustomCheckbox
          onChange={() => {
            getErroFnc(form.getFieldsError(), setIsInvalidFields);
          }}
          rules={[{ required: true, message: "You must agree to the Terms and Conditions and Privacy Policy" }]}
          name="is_agree"
          className={[
            styles.loginBtn,
            !(isCompanyName && isEmail && isPhoneNumber && isDocument && !isInvalidFields) && styles.disabled,
          ].join(" ")}
          label={
            <Link
              to={"https://tridentity-fe-test.tribox.me/privacy-policy.html"}
              style={{ color: "unset" }}
              target="_blank"
            >
              I agree to the <GradientText text="Terms and Conditions" /> and <GradientText text="Privacy Policy" />
            </Link>
          }
        />
        <PrimaryButton
          onClick={() => {
            getErroFnc(form.getFieldsError(), setIsInvalidFields);
          }}
          type="submit"
          className={[styles.loginBtn, !isAgree && styles.disabled].join(" ")}
        >
          Submit
        </PrimaryButton>
        <div className={styles.signUp}>
          You have an account,{" "}
          <GradientText onClick={() => navigate(routers.LOGIN)} className={styles.signUplink} text={"Login here"} />
        </div>
      </>
    );
  };

  const formStep2Part1 = AccountInformationFormFields.slice(4, 9);

  const formStep2Part2 = AccountInformationFormFields.slice(9, 13);

  const SignUpStep2 = () => {
    return (
      <>
        <div className={styles.platform}>MERCHANT PLATFORM</div>
        <div className={styles.title} onClick={() => handleChangeStep(false)}>
          <ArrowLeftOutlined /> Merchant Information
        </div>
        <div className={`${styles.inputWrapper} ${styles.inputWrapperStep2}`}>
          <div className={styles.inputBox}>
            <>
              {formStep2Part1.map((item, index) => {
                if (item.type === "text") {
                  return (
                    <div key={index}>
                      <p>{item.title}</p>
                      <CustomInput
                        type={item.type}
                        onChange={() => {
                          getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                        }}
                        onMouseLeave={() => {
                          getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                        }}
                        maxLength={100}
                        rules={item.rule}
                        placeholder={item.placeholder}
                        name={item.name}
                        onBlur={removeExtraSpace(item.name, form)}
                        style={{ marginBottom: index === formStep2Part1.length - 1 ? "0px" : "0px" }}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={index}>
                      <p>{item.title}</p>
                      <CustomInput
                        type={item.type}
                        onKeyDown={event => {
                          integerOnlyInput(event);
                        }}
                        onChange={e => {
                          getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                          filterECharacterInputNumber(item.name, form, e);
                        }}
                        onMouseLeave={() => {
                          getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                        }}
                        maxLength={100}
                        rules={item.rule}
                        placeholder={item.placeholder}
                        name={item.name}
                        onBlur={removeExtraSpace(item.name, form)}
                        style={{ marginBottom: index === formStep2Part1.length - 1 ? "0px" : "0px" }}
                      />
                    </div>
                  );
                }
              })}
            </>
          </div>
          <div className={styles.inputBox}>
            {formStep2Part2.map((item, index) => {
              if (item.type === "text") {
                return (
                  <div key={index}>
                    <p>{item.title}</p>
                    <CustomInput
                      type={item.type}
                      onChange={() => {
                        getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                      }}
                      onMouseLeave={() => {
                        getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                      }}
                      maxLength={100}
                      rules={item.rule}
                      placeholder={item.placeholder}
                      name={item.name}
                      onBlur={removeExtraSpace(item.name, form)}
                      style={{ marginBottom: index === formStep2Part2.length - 1 ? "0px" : "0px" }}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    <p>{item.title}</p>
                    <CustomInput
                      type={item.type}
                      onKeyDown={event => {
                        integerOnlyInput(event);
                      }}
                      onChange={e => {
                        getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                        filterECharacterInputNumber(item.name, form, e);
                      }}
                      onMouseLeave={() => {
                        getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                      }}
                      maxLength={100}
                      rules={item.rule}
                      placeholder={item.placeholder}
                      name={item.name}
                      onBlur={removeExtraSpace(item.name, form)}
                      style={{ marginBottom: index === formStep2Part1.length - 1 ? "0px" : "0px" }}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>

        <div className={styles.btnBox}>
          <PrimaryButton
            onClick={() => {
              getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
            }}
            type="submit"
            className={[styles.loginBtn, isInvalidFields && styles.disabled].join(" ")}
          >
            Next
          </PrimaryButton>
        </div>
      </>
    );
  };

  const formStep3Part1 = AccountInformationFormFields.slice(13, 17);

  const formStep3Part2 = AccountInformationFormFields.slice(17);

  const SignUpStep3 = () => {
    return (
      <>
        {" "}
        <div className={styles.platform}>MERCHANT PLATFORM</div>
        <div className={styles.title} onClick={() => handleChangeStep(false)}>
          <ArrowLeftOutlined /> Payment Details
        </div>
        <div className={`${styles.inputWrapper} ${styles.inputWrapperStep2}`}>
          <div className={styles.inputBox}>
            {formStep3Part1.map((item, index) => {
              if (item.type === "text") {
                return (
                  <div key={index}>
                    <p>{item.title}</p>
                    <CustomInput
                      type={item.type}
                      onChange={() => {
                        getErroFnc(formStep3.getFieldsError(), setIsInvalidFields);
                      }}
                      onMouseLeave={() => {
                        getErroFnc(formStep3.getFieldsError(), setIsInvalidFields);
                      }}
                      maxLength={100}
                      rules={item.rule}
                      placeholder={item.placeholder}
                      name={item.name}
                      onBlur={removeExtraSpace(item.name, form)}
                      style={{ marginBottom: index === formStep2Part1.length - 1 ? "0px" : "0px" }}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    <p>{item.title}</p>
                    <CustomInput
                      type={item.type}
                      onKeyDown={event => {
                        integerOnlyInput(event);
                      }}
                      onChange={e => {
                        getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                        filterECharacterInputNumber(item.name, form, e);
                      }}
                      onMouseLeave={() => {
                        getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                      }}
                      maxLength={100}
                      rules={item.rule}
                      placeholder={item.placeholder}
                      name={item.name}
                      onBlur={removeExtraSpace(item.name, form)}
                      style={{ marginBottom: index === formStep2Part1.length - 1 ? "0px" : "0px" }}
                    />
                  </div>
                );
              }
            })}
          </div>
          <div className={styles.inputBox}>
            {formStep3Part2.map((item, index) => {
              if (item.type === "text") {
                return (
                  <div key={index}>
                    <p>{item.title}</p>
                    <CustomInput
                      type={item.type}
                      onChange={() => {
                        getErroFnc(formStep3.getFieldsError(), setIsInvalidFields);
                      }}
                      onMouseLeave={() => {
                        getErroFnc(formStep3.getFieldsError(), setIsInvalidFields);
                      }}
                      maxLength={100}
                      rules={item.rule}
                      placeholder={item.placeholder}
                      name={item.name}
                      onBlur={removeExtraSpace(item.name, form)}
                      style={{ marginBottom: index === formStep2Part2.length - 1 ? "0px" : "0px" }}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    <p>{item.title}</p>
                    <CustomInput
                      type={item.type}
                      onKeyDown={event => {
                        integerOnlyInput(event);
                      }}
                      onChange={e => {
                        getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                        filterECharacterInputNumber(item.name, form, e);
                      }}
                      onMouseLeave={() => {
                        getErroFnc(formStep2.getFieldsError(), setIsInvalidFields);
                      }}
                      maxLength={100}
                      rules={item.rule}
                      placeholder={item.placeholder}
                      name={item.name}
                      onBlur={removeExtraSpace(item.name, form)}
                      style={{ marginBottom: index === formStep2Part1.length - 1 ? "0px" : "0px" }}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className={styles.btnBox}>
          <PrimaryButton
            onClick={() => {
              getErroFnc(formStep3.getFieldsError(), setIsInvalidFields);
            }}
            type="submit"
            className={[styles.loginBtn, isInvalidFields && styles.disabled].join(" ")}
          >
            Next
          </PrimaryButton>
        </div>
      </>
    );
  };
  return (
    <div className={styles.formWrapper}>
      <Form
        form={form}
        name="basic"
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true, username: "", password: "" }}
        onFinish={onFinish}
        autoComplete="off"
        style={{ padding: "32px 102px" }}
      >
        <div className={styles.logoWrapper}>
          <TrifoodLogo />
        </div>

        {signUpStep === 1 && SignUpStep1()}
      </Form>
      <Form
        form={formStep2}
        name="formStep2"
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true, username: "", password: "" }}
        onFinish={onFinishStep2}
        autoComplete="off"
        style={{ padding: "0px 102px 20px 102px" }}
      >
        {signUpStep === 2 && SignUpStep2()}
      </Form>

      <Form
        form={formStep3}
        name="formStep3"
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true, username: "", password: "" }}
        onFinish={onFinishStep3}
        autoComplete="off"
        style={{ padding: "0px 102px 20px 102px" }}
      >
        {signUpStep === 3 && SignUpStep3()}
      </Form>

      <CustomModal
        onOk={() => navigate(routers.LOGIN)}
        onCancel={() => setOpenModal(false)}
        open={openModal}
        footer={
          <div className={styles.buttonWrapper}>
            <div className={styles.returnButton} onClick={() => navigate(routers.LOGIN)}>
              <GradientText text="Return" />
            </div>
          </div>
        }
        title={"Welcome to Tridentity"}
      >
        <div className={styles.welcome}>
          Onboarding request is being reviewed by the platform. Further notice will be sent via email in a short time.
          Thank you for your application!
        </div>
      </CustomModal>
    </div>
  );
};

export default SignUpForm;
