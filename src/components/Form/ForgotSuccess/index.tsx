import { Form } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../commons/components/PrimaryButton/PrimaryButton";
import { routers } from "../../../commons/constants/routers";
import { TrifoodLogo } from "../../../commons/resources";
import styles from "./login-form.module.scss";

const ForgotSuccessForm: React.FC = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const myEmail = urlParams.get("email");

  const [form] = Form.useForm<LoginBody>();
  const onFinish = async (values: LoginBody) => {
    navigate(routers.FORGOT_PASSWORD);
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
        style={{ padding: "32px 85px" }}
      >
        <div className={styles.logoWrapper}>
          <TrifoodLogo />
        </div>
        <div className={styles.platform}>MERCHANT PLATFORM</div>
        <div className={styles.textDes}>
          An email has been sent to: <span style={{ fontWeight: "bold" }}>{myEmail}</span> Please check your email to
          reset your password
        </div>
        <PrimaryButton type="submit" className={styles.loginBtn}>
          Continue
        </PrimaryButton>
      </Form>
    </div>
  );
};

export default ForgotSuccessForm;
