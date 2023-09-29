import React, { useEffect } from "react";
import { Form } from "antd";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import styles from "./set-password.module.scss";
import PrimaryButton from "../../../commons/components/PrimaryButton/PrimaryButton";
import { LockOutlineIcon, TrifoodLogo } from "../../../commons/resources";
import useCheckPassword, { PasswordStrength } from "../../../hooks/useCheckPassword";
import PasswordStrengthBar from "../../PasswordStrengthbar/PasswordStrengthbar";

interface SetPasswordProps {
  onReset: (value: ResetPasswordFormBody) => void;
  placeholderPassword?: string;
  placeholderConfirmPassword?: string;
  className?: string;
  confirmText?: string;
}
const SetPasswordForm: React.FC<SetPasswordProps> = ({
  onReset,
  placeholderPassword = "Password",
  placeholderConfirmPassword = "Confirm password",
  className,
  confirmText = "Go to dashboard",
}: SetPasswordProps) => {
  const { passwordStrength, checkPasswordStrength } = useCheckPassword();
  const [form] = Form.useForm<ResetPasswordFormBody>();
  const onFinish = (values: ResetPasswordFormBody) => {
    onReset(values);
  };
  const password = Form.useWatch("newPassword", form);

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
              name="newPassword"
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
            name="confirmNewPassword"
            placeholder={placeholderConfirmPassword}
            type="password"
            prefix={<LockOutlineIcon />}
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },

              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords that you entered do not match!"));
                },
              }),
            ]}
          />
        </div>
        <PrimaryButton type="submit" className={styles.loginBtn}>
          {confirmText}
        </PrimaryButton>
      </Form>
    </div>
  );
};

export default SetPasswordForm;
