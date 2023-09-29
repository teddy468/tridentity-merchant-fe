import { Form, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import CustomModal from "../../../commons/components/CustomModal/CustomModal";
import PrimaryButton from "../../../commons/components/PrimaryButton/PrimaryButton";
import { MERCHANT_ONBOARD_VERIFY } from "../../../commons/constants/api-urls";
import { KeyboardIcon } from "../../../commons/resources";
import defaultAxios from "../../../commons/utils/axios";
import styles from "./verify-otp.module.scss";
import InputOtp from "../../../commons/components/CustomInput/OtpInput";

interface VerifyOTPProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  merchantOnboardId: string;
  onSuccess: (activate_token: string) => void;
  email: string;
}
const VerifyOTP = ({ open, setOpen, name, merchantOnboardId, email, onSuccess }: VerifyOTPProps) => {
  const [form] = useForm<{ otp: string }>();
  const [hiddenEmail, setHiddenEmail] = useState<string>("");

  const onFinish = async (values: { otp: string }) => {
    if (!merchantOnboardId) return message.error("merchant onboard request not found!");
    try {
      const res: AxiosResponse<{ activate_token: string }> = await defaultAxios.put(
        MERCHANT_ONBOARD_VERIFY(merchantOnboardId),
        values
      );
      if (res?.data.activate_token) {
        message.success("verify otp success");
        onSuccess(res.data.activate_token);
      }
    } catch (error) {
      message.error("Invalid OTP");
    }
  };

  useEffect(() => {
    if (email) {
      const emailArr = email.split("@");
      const hiddenEmail = `${emailArr[0].slice(0, 3)}
        ${"*".repeat(emailArr[0].length - 3)}@${emailArr[1]}`;
      setHiddenEmail(hiddenEmail);
    }
  }, [email]);

  return (
    <CustomModal open={open} onCancel={() => setOpen(false)} title={"Sign up"}>
      <Form onFinish={onFinish} form={form} className={styles.content}>
        <div className={styles.description}>
          Welcome, {name}
          <br /> Please enter the OTP we have sent to <br />
          {hiddenEmail}
        </div>
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Please input your code!" },
            {
              min: 6,
              message: "OTP must be 6 digits",
            },
          ]}
        >
          <InputOtp
            setOtp={value => {
              form.setFieldsValue({ otp: value });
            }}
          />
        </Form.Item>

        <div className={styles.footer}>
          <PrimaryButton type="submit">Confirm</PrimaryButton>
        </div>
      </Form>
    </CustomModal>
  );
};
export default VerifyOTP;
