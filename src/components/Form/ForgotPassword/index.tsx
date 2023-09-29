import { Col, Form, message, Row } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import BorderGradientButton from "../../../commons/components/BorderGradientButton/BorderGradientButton";
import CustomIcon from "../../../commons/components/CustomIcon/CustomIcon";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import GradientText from "../../../commons/components/GradientText/GradientText";
import PrimaryButton from "../../../commons/components/PrimaryButton/PrimaryButton";
import { FORGOT_PASSWORD } from "../../../commons/constants/api-urls";
import { navigations, routers } from "../../../commons/constants/routers";
import { EmailIconForgot,TrifoodLogo } from "../../../commons/resources";
import defaultAxios from "../../../commons/utils/axios";
import styles from "./login-form.module.scss";

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginBody>();
  const onFinish = async (values: any) => {
    try {
      const res = await defaultAxios.post<LoginResponse>(FORGOT_PASSWORD, values);
      if (res.status >= 200 && res.status < 400) {
        navigate(`${navigations.FORGOT_SUCCESS}?email=${values?.email}`);
      }
    } catch (error: any) {
      message.error("Incorrect your email!");
    }
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
        <div className={styles.platform}>MERCHANT PLATFORM</div>
        <div className={styles.title}>Forgot password</div>
        <div className={styles.inputWrapper}>
          <CustomInput
            placeholder="Enter your account Email"
            type={"email"}
            name="email"
            rules={[
              {
                required: true,
                message: "This field is required",
                whitespace: true,
              },
            ]}
            prefix={<CustomIcon icon={EmailIconForgot} fill="currentColor" width={20} />}
          />
        </div>
        <div className={styles.textDes}>Enter your email for password recovery</div>
        <div className={styles.groupButton}>
          <Row style={{ width: "100%" }}>
            <Col span={12}>
              <BorderGradientButton style={{ width: "90%", marginBottom: 0 }} onClick={() => navigate(routers.LOGIN)}>
                <GradientText text="Cancel" />
              </BorderGradientButton>
            </Col>
            <Col span={12}>
              <PrimaryButton style={{ width: "90%", marginLeft: "10%" }} type="submit">
                Submit
              </PrimaryButton>
            </Col>
          </Row>
        </div>
        {/* <PrimaryButton type="submit" className={styles.loginBtn}>
          Submit
        </PrimaryButton> */}
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
