import React from "react";
import { Checkbox, Form, FormItemProps } from "antd";
import styles from "./CheckBoxList.module.scss";
import { CheckboxGroupProps } from "antd/es/checkbox";

interface Props extends Omit<CheckboxGroupProps, "name"> {
  label?: React.ReactNode;
  groupClassName?: string;
  rules?: FormItemProps["rules"];
  groupProps?: FormItemProps;
  name?: string | (string | number)[];
}

const CheckBoxList: React.FC<Props> = props => {
  const { className, groupClassName, label, name, rules, groupProps, ...listProps } = props;

  return (
    <Form.Item
      name={name}
      rules={rules}
      className={`${styles.group} ${className ?? ""}`}
      label={label}
      labelCol={{ span: 6 }}
      labelAlign="left"
      {...groupProps}
    >
      <Checkbox.Group className={`${styles.list} ${groupClassName ?? ""}`} {...listProps} />
    </Form.Item>
  );
};
export default CheckBoxList;
