import { FC, useContext } from "react";
import { DownOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Dropdown, Popconfirm, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { routers } from "../../../commons/constants/routers";
import { AppContext } from "../../../contexts/AppContext";
import styles from "./custom-layout.module.scss";
import { Image } from "../../../commons/components/Image";

const AccountDropdown: FC = () => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <Space wrap>
      <Dropdown
        menu={{
          items: [
            {
              key: routers.DASHBOARD,
              label: "Profile settings",
              icon: <UserOutlined />,
            },
            {
              key: "logout",
              danger: true,
              label: (
                <Popconfirm
                  placement="left"
                  title={"Logout"}
                  description={"Do you want to logout?"}
                  onConfirm={logout}
                  okText="Confirm"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px" }}>
                    <LogoutOutlined /> Logout
                  </div>
                </Popconfirm>
              ),
            },
          ],
          onClick: item => item.key !== "logout" && navigate(item.key),
        }}
      >
        <Button
          className={styles.account}
          icon={<Image round={3} src={user?.avatar} width={20} height={20} placeholder={UserOutlined} />}
        >
          <Space>
            <Space className={styles.username}>{user?.username}</Space>
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Space>
  );
};

export default AccountDropdown;
