import CustomModal from "../../commons/components/CustomModal/CustomModal";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import { TrifoodLogo } from "../../commons/resources";
import styles from "./lp.module.scss";

interface ModalSubmitProps {
  id: number;
  content: string;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

export const ModalSubmit = (props: ModalSubmitProps) => {
  const { id, content, openModal, setOpenModal } = props;
  return (
    <CustomModal
      maskClosable={true}
      footer={
        <PrimaryButton className={styles.addProductBtn} onClick={() => setOpenModal(false)}>
          OK
        </PrimaryButton>
      }
      open={openModal}
      onCancel={() => setOpenModal(false)}
    >
      <div className={styles.logoWrapper}>
        <TrifoodLogo />
      </div>
      <div className={styles.title}>REQUEST RECEIVED</div>
      <div className={styles.modal}>
        <div className={styles.body}>{content}</div>
        <div className={styles.requestId}>Request ID : {id}</div>
      </div>
    </CustomModal>
  );
};
