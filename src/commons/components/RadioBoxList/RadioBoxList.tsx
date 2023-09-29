import React from "react";
import { Radio, Form, FormItemProps } from "antd";
import styles from "./RadioBoxList.module.scss";
import { RadioGroupProps } from "antd/es/radio";

interface Props extends Omit<RadioGroupProps, "name"> {
  label?: React.ReactNode;
  groupClassName?: string;
  rules?: FormItemProps["rules"];
  groupProps?: FormItemProps;
  name?: string | (string | number)[];
}

const RadioBoxList: React.FC<Props> = props => {
  const { className, groupClassName, label, name, rules, groupProps, ...listProps } = props;
  return (
    <Form.Item
      {...props}
      name={name}
      rules={rules}
      className={`${styles.group} ${className ?? ""}`}
      label={label}
      labelCol={{ span: 6 }}
      labelAlign="left"
      {...groupProps}
    >
      <Radio.Group className={`${styles.list} ${groupClassName ?? ""}`} {...listProps} />
    </Form.Item>
  );
};

export default RadioBoxList;
