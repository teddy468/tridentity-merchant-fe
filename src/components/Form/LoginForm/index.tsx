import { Form, message } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CustomIcon from "../../../commons/components/CustomIcon/CustomIcon";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import GradientText from "../../../commons/components/GradientText/GradientText";
import PrimaryButton from "../../../commons/components/PrimaryButton/PrimaryButton";
import { MERCHANT, REFRESH_TOKEN_KEY, TOKEN_KEY } from "../../../commons/constants";
import { LOGIN_URL } from "../../../commons/constants/api-urls";
import { navigations, routers } from "../../../commons/constants/routers";
import { LockOutlineIcon, UserOctagonIcon, TrifoodLogo } from "../../../commons/resources";
import defaultAxios from "../../../commons/utils/axios";
import { AppContext } from "../../../contexts/AppContext";
import styles from "./login-form.module.scss";
import { SERVICE_SUPPORTS } from "../../../commons/constants/store";
import { MODES } from "../../../commons/constants/user";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setCurrentStore } = useContext(AppContext);
  const [form] = Form.useForm<LoginBody>();
  const onFinish = async (values: LoginBody) => {
    try {
      const res = await defaultAxios.post<LoginResponse>(LOGIN_URL, values);
      localStorage.setItem(TOKEN_KEY, res.data.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refresh_token);
      localStorage.setItem(MERCHANT, JSON.stringify(res.data));
      setUser(res.data);

      if (res.data.merchant_role.id === MODES.USER) {
        // setCurrent when merchant member login
        setCurrentStore(res.data.merchantStoreAuthorities[0].merchantStore);
        // navigate to store because merchant member only have one store and monpher labs is stupid
        navigate(navigations.STORES.REPORT(res.data.merchantStoreAuthorities[0].merchantStore.id));
      } else {
        navigate(navigations.DASHBOARD);
      }
    } catch (error: any) {
      const mesg = error?.response?.data?.error?.message;
      let res = mesg.charAt(0).toUpperCase() + mesg.slice(1);
      message.error(res);
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
        <div className={styles.title}>Login</div>
        <div className={styles.inputWrapper}>
          <CustomInput
            placeholder="Email"
            name="identifier"
            rules={[
              {
                required: true,
                message: "This field is required",
                whitespace: true,
              },
            ]}
            prefix={<CustomIcon icon={UserOctagonIcon} fill="currentColor" width={20} />}
          />
          <CustomInput
            placeholder="Password"
            type="password"
            name="password"
            rules={[
              {
                required: true,
                message: "This field is required",
                whitespace: true,
              },
            ]}
            prefix={<CustomIcon icon={LockOutlineIcon} fill="currentColor" width={20} />}
          />
        </div>
        <div className={styles.forgotPassword} onClick={() => navigate(routers.FORGOT_PASSWORD)}>
          Forgot password?
        </div>
        <PrimaryButton type="submit" className={styles.loginBtn}>
          Login
        </PrimaryButton>
        <div className={styles.signUp}>
          You don't have account,{" "}
          <GradientText onClick={() => navigate(routers.SIGN_UP)} className={styles.signUplink} text={"Sign up here"} />
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
