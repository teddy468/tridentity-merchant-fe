import React from "react";
import { Form, FormItemProps, TimePicker, TimePickerProps } from "antd";
import styles from "./TimeInput.module.scss";
import CustomIcon from "../CustomIcon/CustomIcon";
import { ArrowDownIcon } from "../../resources";

interface Props extends TimePickerProps {
  name: string;
  label: React.ReactNode;
  rules?: FormItemProps["rules"];
  pickerClassName?: string;
}

const TimeInput: React.FC<Props> = props => {
  const { className, pickerClassName, name, label, rules, placement, ...pickerProps } = props;

  return (
    <Form.Item noStyle dependencies={[name]}>
      {({ setFieldValue }) => (
        <Form.Item
          name={name}
          rules={rules}
          className={`${styles.group}  ${className ?? ""}`}
          label={label}
          labelCol={{ span: 24 }}
        >
          <TimePicker
            className={`${styles.picker} ${pickerClassName ?? ""}`}
            suffixIcon={<CustomIcon icon={ArrowDownIcon} width={20} fill="currentColor" />}
            placement={placement || "bottomRight"}
            popupClassName={styles.dropdown}
            onChange={value => setFieldValue(name, value)}
            {...pickerProps}
          />
        </Form.Item>
      )}
    </Form.Item>
  );
};
export default TimeInput;
