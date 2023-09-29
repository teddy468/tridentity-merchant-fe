import { Space, Spin } from "antd";
import styles from "./loading.module.scss";

export const Loading = () => {
  return (
    <Space className={styles.loading}>
      <Spin size="large" />
    </Space>
  );
};
