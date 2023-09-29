import { Modal, ModalProps } from "antd";
import styles from "./custom-modal.module.scss";
interface CustomModalProps extends ModalProps {
  className?: string;
  classTitle?: string;
  classBottom?: string;
}

const CustomModal = (props: CustomModalProps) => {
  const { className, title, open, onOk, onCancel, children, footer, classTitle, classBottom, maskClosable } = props;

  return (
    <Modal
      maskClosable={maskClosable}
      footer={<></>}
      onOk={onOk}
      onCancel={onCancel}
      open={open}
      className={`${styles.customModal} ${className}`}
    >
      <div className={styles.content}>
        <div className={`${classTitle} ${styles.title}`}> {title}</div>
        {children}
        <div className={`${classBottom}`}>{footer}</div>
      </div>
    </Modal>
  );
};

export default CustomModal;
