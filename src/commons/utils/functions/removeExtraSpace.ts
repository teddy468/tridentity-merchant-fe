import { FormInstance } from "antd";

const removeExtraSpace = (fieldName: string, form: FormInstance) => (event: any) => {
  const { value } = event.target;
  form.setFieldsValue({ [fieldName]: value.replace(/\s+/g, " ").trim() });
};

export default removeExtraSpace;
