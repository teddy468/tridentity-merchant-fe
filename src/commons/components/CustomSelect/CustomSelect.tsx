import { Form, FormItemProps, Select, SelectProps } from "antd";
import { BaseOptionType } from "antd/es/select";
import styles from "./CustomSelect.module.scss";

interface Props extends SelectProps {
  name?: string | (string | number)[];
  label?: React.ReactNode;
  rules?: FormItemProps["rules"];
  selectClassName?: string;
  prefixIcon?: React.ReactNode;
}

export const CustomSelect = (props: Props) => {
  const { defaultValue, name, rules, label, className, selectClassName, prefixIcon, ...selectProps } = props;
  const filterOption = (search: string, option?: BaseOptionType) => {
    if (!option) return false;
    const regex = new RegExp(search, "i");
    return regex.test(option.label);
  };

  return (
    <Form.Item className={`${styles.wrapper} ${className ?? "input"}`}>
      {prefixIcon && <div className={styles["prefix-icon-wrapper"]}>{prefixIcon}</div>}
      <Form.Item
        name={name}
        className={`${styles.group} ${label ? styles.label : ""}`}
        label={label}
        rules={rules}
        labelCol={{ span: 24 }}
      >
        <Select
          className={`${styles.customInput} ${prefixIcon && styles.customIcon} ${selectClassName ?? ""}`}
          {...selectProps}
          showSearch
          filterOption={filterOption}
        />
      </Form.Item>
    </Form.Item>
  );
};
