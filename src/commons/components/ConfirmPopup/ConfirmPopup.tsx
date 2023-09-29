import { ModalProps } from "antd";
import CustomModal from "../CustomModal/CustomModal";
import GradientText from "../GradientText/GradientText";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import styles from "./confirm-popup.module.scss";

interface ConfirmPopupProps extends ModalProps {
  className?: string;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  className,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  ...modalProps
}: ConfirmPopupProps) => {
  return (
    <CustomModal className={styles.confirmPopup} {...modalProps}>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.footer}>
        <div className={styles.cancelButton} onClick={onCancel}>
          <GradientText text={cancelText}></GradientText>
        </div>
        <PrimaryButton className={styles.confirmButton} onClick={onConfirm}>
          {confirmText}
        </PrimaryButton>
      </div>
    </CustomModal>
  );
};

export default ConfirmPopup;
