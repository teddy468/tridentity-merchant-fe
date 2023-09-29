import { Form, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import PrimaryButton from "../../../commons/components/PrimaryButton/PrimaryButton";
import { RESET_PASSWORD } from "../../../commons/constants/api-urls";
import { routers } from "../../../commons/constants/routers";
import { LockOutlineIcon, TrifoodLogo } from "../../../commons/resources";
import defaultAxios from "../../../commons/utils/axios";
import styles from "./reset-password.module.scss";
import useCheckPassword, { PasswordStrength } from "../../../hooks/useCheckPassword";
import PasswordStrengthBar from "../../PasswordStrengthbar/PasswordStrengthbar";

interface ResetPasswordProps {
  onReset: (value: ResetPasswordFormBody) => void;
  placeholderPassword?: string;
  placeholderConfirmPassword?: string;
  className?: string;
  confirmText?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordProps> = ({
  placeholderPassword = "New password",
  placeholderConfirmPassword = "Confirm new password",
  className,
  confirmText = "Submit",
}: ResetPasswordProps) => {
  const navigate = useNavigate();
  const { passwordStrength, checkPasswordStrength } = useCheckPassword();
  const [form] = Form.useForm<ResetPasswordFormBody>();
  const urlParams = new URLSearchParams(window.location.search);
  const [textButton, setTextButton] = useState<string>(confirmText);
  const [loading, setLoading] = useState(false);
  const reset_password_token = urlParams.get("token");
  const onFinish = async (values: ResetPasswordFormBody) => {
    try {
      if (textButton === "Back to Login") {
        navigate(routers.LOGIN);
      } else {
        setLoading(true);
        const res = await defaultAxios.post(RESET_PASSWORD, { ...values, reset_password_token });
        if (res.status >= 200 && res.status < 400) {
          message.success("Password has been reset");
          setTextButton("Back to Login");
        }
      }
    } catch (error) {
      message.error("Entered Password does not match or token has been expired ");
    } finally {
      setLoading(false);
    }
  };

  const password = Form.useWatch("new_password", form);

  return (
    <div className={[styles.formWrapper, className].join(" ")}>
      <Form
        form={form}
        name="basic"
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        autoComplete="off"
        style={{ padding: "32px 102px" }}
      >
        <div className={styles.logoWrapper}>
          <TrifoodLogo />
        </div>

        <div className={styles.platform}>MERCHANT PLATFORM</div>
        <div className={styles.title}>Set your password</div>
        <div className={styles.inputWrapper}>
          <div className={styles.inputBox}>
            <CustomInput
              name="new_password"
              type="password"
              placeholder={placeholderPassword}
              prefix={<LockOutlineIcon />}
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters",
                },
                {
                  validator: (_, value) => {
                    if (passwordStrength === PasswordStrength.Weak && value?.length >= 6) {
                      return Promise.reject(new Error("Include numbers and letters to make your password stronger"));
                    }
                    return Promise.resolve();
                  },
                  warningOnly: true,
                },
              ]}
              onChange={e => {
                checkPasswordStrength(e.target.value);
              }}
            />
            {password?.length > 0 && (
              <PasswordStrengthBar passwordStrength={passwordStrength} active={password?.length > 0 ? true : false} />
            )}
          </div>
          <CustomInput
            name="current_password"
            placeholder={placeholderConfirmPassword}
            type="password"
            prefix={<LockOutlineIcon />}
            dependencies={["new_password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },

              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Let's include numbers and letters to make your password stronger"));
                },
              }),
            ]}
          />
        </div>
        <PrimaryButton className={styles.loginBtn} disabled={loading}>
          {textButton}
        </PrimaryButton>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
