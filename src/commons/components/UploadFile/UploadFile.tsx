import { DocumentUploadIcon } from "../../resources";
import { Form, FormItemProps, UploadProps } from "antd";
import { Upload } from "antd";
import styles from "./upload-file.module.scss";
import { IMAGE_TYPE_ALLOW } from "../../constants";
import { UPLOAD_FILE_URL } from "../../constants/api-urls";

const { Dragger } = Upload;
const { JPEG, JPG, PNG, SVG } = IMAGE_TYPE_ALLOW;
const ACCEPTEDS = [JPEG, JPG, PNG, SVG, ".pdf", ".doc", ".docx"];
interface UploadFileProps extends Omit<UploadProps, "multiple"> {
  label?: React.ReactNode;
  name: string;
  ref?: React.Ref<any>;
  multiple?: boolean;
  square?: boolean;
  rules?: FormItemProps["rules"];
  uploadClassName?: string;
  description?: React.ReactNode;
}
const UploadFile: React.FC<UploadFileProps> = (props: UploadFileProps) => {
  const {
    className,
    uploadClassName,
    name,
    label,
    description,
    ref,
    multiple,
    rules,
    square,
    maxCount,
    ...uploadProps
  } = props;

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };
  return (
    <Form.Item name={name} valuePropName="fileList" getValueFromEvent={normFile} rules={rules}>
      <Dragger
        multiple={multiple}
        maxCount={maxCount}
        name="file"
        accept={ACCEPTEDS.join(",")}
        beforeUpload={e => {
          return false;
        }}
        {...uploadProps}
        action={`${process.env.REACT_APP_BASE_URL}${UPLOAD_FILE_URL}`}
        className={`${styles.uploadFile} ${className}`}
      >
        <div className={styles.description}>
          <DocumentUploadIcon /> <span>{description}</span>
        </div>
      </Dragger>
    </Form.Item>
  );
};

export default UploadFile;
