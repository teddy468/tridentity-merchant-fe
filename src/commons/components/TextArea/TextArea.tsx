import React from "react";
import { Form, FormItemProps, Input } from "antd";
import styles from "./TextArea.module.scss";
import { TextAreaProps } from "antd/es/input";

interface Props extends TextAreaProps {
  label: React.ReactNode;
  rules?: FormItemProps["rules"];
  textareaClassName?: string;
}

const TextArea: React.FC<Props> = props => {
  const { className, textareaClassName, name, label, rules, rows, ...textareaProps } = props;

  return (
    <Form.Item
      name={name}
      rules={rules}
      className={`${styles.group} ${className ?? ""}`}
      label={label}
      labelCol={{ span: 24 }}
    >
      <Input.TextArea className={`${styles.textarea} ${textareaClassName ?? ""}`} rows={rows || 4} {...textareaProps} />
    </Form.Item>
  );
};
export default TextArea;
