import { Checkbox, CheckboxProps, Form, FormItemProps } from "antd";
import "./custom-checkbox.scss";
interface CustomCheckboxProps extends Omit<CheckboxProps, "name"> {
  name?: string | (string | number)[];
  errorMessage?: React.ReactNode;
  inputClassName?: string;
  errorClassName?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  label?: React.ReactNode;
  rules?: FormItemProps["rules"];
  restField?: {
    fieldKey?: number | undefined;
  };
}

const CustomCheckbox = (props: CustomCheckboxProps) => {
  const {
    className,
    errorMessage,
    inputClassName,
    errorClassName,
    startAdornment,
    endAdornment,
    label,
    rules,
    name,
    restField,
    onChange,
    ...checkboxProps
  } = props;
  return (
    <Form.Item
      name={name}
      className={`${className ?? ""} custom-checkbox`}
      rules={rules}
      valuePropName="checked"
      labelCol={{ span: 24 }}
      {...restField}
    >
      <Checkbox {...checkboxProps}>{label}</Checkbox>
    </Form.Item>
  );
};

export default CustomCheckbox;
