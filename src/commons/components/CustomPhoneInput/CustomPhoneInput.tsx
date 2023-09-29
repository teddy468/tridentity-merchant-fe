import * as React from "react";
import styles from "./custom-phone-input.module.scss";
import { FormInstance, FormItemProps, InputProps } from "antd";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { MobileIcon } from "../../resources";
import CustomInput from "../CustomInput/CustomInput";
import { PREFIXES } from "../../constants/user";

type Props = InputProps & {
  name: string;
  formInstance: FormInstance;
  rules?: FormItemProps["rules"];
  label?: React.ReactNode;
};

const CustomPhoneInput = React.forwardRef((props: Props) => {
  const { name, rules, formInstance, label, ...inputProps } = props;

  return (
    <CustomInput
      name={name}
      type="number"
      label={label}
      rules={rules}
      className={styles.customPhoneInput}
      {...inputProps}
      prefix={
        <CustomSelect
          className={styles.customSelect}
          prefixIcon={<MobileIcon />}
          onClick={e => e.stopPropagation()}
          onChange={() => {
            formInstance.validateFields(["phone"]);
          }} // validate phone number when change region
          name="region"
          options={PREFIXES}
          suffixIcon={<></>}
          style={{ border: "none" }}
        />
      }
    />
  );
});

export default CustomPhoneInput;
