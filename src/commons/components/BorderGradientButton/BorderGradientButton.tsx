import { Button, ButtonProps } from "antd";
import styles from "./BorderGradientButton.module.scss";

const BorderGradientButton = ({ className, ...props }: ButtonProps) => {
  return <Button className={`${styles.button} ${className}`} {...props} />;
};

export default BorderGradientButton;
