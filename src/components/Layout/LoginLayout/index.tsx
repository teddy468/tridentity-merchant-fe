import { FC, ReactNode } from "react";
import { Col, Row } from "antd";
import styles from "./login-layout.module.scss";

const LoginLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Row gutter={[16, 16]} className={styles.row}>
      <Col span={24} sm={24} className={styles.col}>
        {children}
      </Col>
    </Row>
  );
};

export default LoginLayout;
