import { Button, Form, ModalProps, message } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import CustomModal from "../../../commons/components/CustomModal/CustomModal";
import GradientText from "../../../commons/components/GradientText/GradientText";
import PrimaryButton from "../../../commons/components/PrimaryButton/PrimaryButton";
import {
  EMAIL_PATTERN,
  PHONE_NUMBER_PATTERN,
  PHONE_NUMBER_VIETNAM,
  getCurrentPattern,
} from "../../../commons/constants";
import styles from "./AddNewMember.module.scss";
import { CustomSelect } from "../../../commons/components/CustomSelect/CustomSelect";
import { AppContext } from "../../../contexts/AppContext";
import { integerOnlyInput } from "../../../commons/utils/functions/integerOnly";
import defaultAxios from "../../../commons/utils/axios";
import { ADD_NEW_MEMBER_MERCHANT, EDIT_MEMBER_MERCHANT } from "../../../commons/constants/api-urls";
import CustomPhoneInput from "../../../commons/components/CustomPhoneInput/CustomPhoneInput";
import removeExtraSpace from "../../../commons/utils/functions/removeExtraSpace";
import { PREFIXES } from "../../../commons/constants/user";
interface AddNewMemberProps extends ModalProps {
  onCancel: () => void;
  member?: MerchantMember;
  isEdit?: boolean;
  refresh: () => void;
  open: boolean;
}
const AddNewMember: React.FC<AddNewMemberProps> = ({
  member,
  isEdit,
  onCancel,
  refresh,
  open,
  ...props
}: AddNewMemberProps) => {
  const [form] = Form.useForm<MerchantMember>();
  const { store } = useContext(AppContext);
  const onFinishCreateMember = async (values: MerchantMember) => {
    const bodyAddMemberMerchant = {
      email: values.email,
      phone: values.region! + values.phone,
      merchant_stores_ids: [values.merchant_stores_ids],
    };
    try {
      await defaultAxios.post<any>(ADD_NEW_MEMBER_MERCHANT, bodyAddMemberMerchant);
      message.success("Add new member successfully");
      form.resetFields();
      refresh();
    } catch (error) {
      message.error("Add new member failed");
    }
    onCancel();
  };

  const onFinishEditMember = async (values: MerchantMember) => {
    const bodyEditMemberMerchant = {
      storeIds: [values.merchant_stores_ids],
      merchant_member_id: Number(member?.merchant_member_id),
    };
    try {
      await defaultAxios.put(EDIT_MEMBER_MERCHANT(), bodyEditMemberMerchant);
      message.success("Edit member successfully");
      form.resetFields();
      refresh();
    } catch (error) {
      message.error("Edit member failed");
    }
    onCancel();
  };

  function handleCloseModal() {
    form.resetFields();
    onCancel();
  }
  const region = Form.useWatch("region", form);

  const phonePattern = useMemo(() => getCurrentPattern(region), [region]);

  useEffect(() => {
    if (open) {
      form.setFieldValue("region", PREFIXES[0].value);
    }
  }, [form, open]);

  useEffect(() => {
    if (!member) return;
    form.setFieldsValue(member);
  }, [member, form]);

  if (isEdit) {
    return (
      <CustomModal open={open} {...props} title={`Edit member store`}>
        <Form onFinish={onFinishEditMember} form={form}>
          <div className={styles.label}>Member Store</div>
          <CustomSelect
            placeholder="Select store"
            options={store.data.map(item => ({ label: item.name, value: item.id }))}
            name="merchant_stores_ids"
            rules={[
              {
                required: true,
                message: "Please select store!",
              },
            ]}
          />
          <div className={styles.groupButton}>
            <div className={styles.btnCancel} onClick={handleCloseModal}>
              <GradientText text={"Cancel"}></GradientText>
            </div>
            <PrimaryButton type="submit" className={styles.btnConfirm}>
              Save
            </PrimaryButton>
          </div>
        </Form>
      </CustomModal>
    );
  } else {
    return (
      <CustomModal open={open} {...props} title={`${isEdit ? "Edit" : "Add new"} member`}>
        <Form onFinish={onFinishCreateMember} form={form}>
          <div className={styles.label}>Email</div>
          <CustomInput
            name="email"
            placeholder="Enter member email"
            rules={[
              {
                required: true,
                message: "Please input email!",
                whitespace: true,
              },
              {
                pattern: EMAIL_PATTERN,
                message: "Invalid email",
              },
            ]}
            onBlur={() => removeExtraSpace("email", form)}
          />
          <div className={styles.label}>Member Phone</div>
          <CustomPhoneInput
            formInstance={form}
            name="phone"
            placeholder="Enter member phone number"
            rules={[
              {
                required: true,
                message: "Please input phone number!",
              },
              {
                pattern: phonePattern,
                message: "Invalid phone number",
              },
            ]}
            onKeyDown={integerOnlyInput}
            onBlur={() => removeExtraSpace("phone", form)}
          />
          <div className={styles.label}>Member Store</div>
          <CustomSelect
            placeholder="Select store"
            options={store.data.map(item => ({ label: item.name, value: item.id }))}
            name="merchant_stores_ids"
            rules={[
              {
                required: true,
                message: "Please select store!",
              },
            ]}
          />
          <div className={styles.groupButton}>
            <div className={styles.btnCancel} onClick={handleCloseModal}>
              <GradientText text={"Cancel"}></GradientText>
            </div>
            <PrimaryButton type="submit" className={styles.btnConfirm}>
              {isEdit ? "Save" : "Add member"}
            </PrimaryButton>
          </div>
        </Form>
      </CustomModal>
    );
  }
};

export default AddNewMember;
