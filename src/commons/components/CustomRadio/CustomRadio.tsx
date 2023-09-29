import { Form, Radio, RadioProps } from "antd";
import styles from "./custom-radio.module.scss";
interface CustomRadioProps extends Omit<RadioProps, "name"> {
  value: string;
  label: string;
  name?: string | (string | number)[];
}

const CustomRadio: React.FC<CustomRadioProps> = ({ label, value, name, ...rest }: CustomRadioProps) => {
  return (
    <Form.Item className={styles.customRadio} name={name} {...rest}>
      <Radio value={value}>{label}</Radio>
    </Form.Item>
  );
};

export default CustomRadio;
