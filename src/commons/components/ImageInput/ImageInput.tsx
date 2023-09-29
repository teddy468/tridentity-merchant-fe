import React from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Form, FormItemProps, Upload, UploadProps } from "antd";
import { IMAGE } from "../../constants/message";
import { IMAGE_TYPE_ALLOW } from "../../constants";
import { uploadAxios } from "../../utils/axios";
import { UPLOAD_FILE_URL } from "../../constants/api-urls";
import styles from "./ImageInput.module.scss";
import CustomIcon from "../CustomIcon/CustomIcon";
import { GalleryAddIcon, TrashIcon } from "../../resources";

interface UploadResultType {
  url: string;
  fileName: string;
  fullPath: string;
}

interface Props extends Omit<UploadProps, "multiple"> {
  label: React.ReactNode;
  name: string;
  onError?: (err: string) => void;
  onSubmit?: (file: File) => void;
  onSuccess: (result: UploadResultType) => void;
  ref?: React.Ref<any>;
  multiple?: boolean | number;
  square?: boolean;
  rules?: FormItemProps["rules"];
  uploadClassName?: string;
  description?: React.ReactNode;
  isSingle?: boolean;
}

const { JPEG, JPG, PNG, SVG } = IMAGE_TYPE_ALLOW;
const ACCEPTEDS = [JPEG, JPG, PNG, SVG];

const ImageInput: React.FC<Props> = props => {
  const {
    className,
    uploadClassName,
    onError,
    onSubmit,
    onSuccess,
    name,
    label,
    description,
    ref,
    multiple,
    rules,
    square,
    isSingle = false,
    disabled = false,
    ...uploadProps
  } = props;

  const handleUpload = async (file: File) => {
    const { type, size } = file;
    const allowType = ACCEPTEDS.includes(type);
    const allowSize = size < 1024 * 1024 * 2;
    if (!allowSize) onError?.(IMAGE.NOT_EXCEED_2MB);
    if (!allowType) onError?.(IMAGE.NOT_ALLOW_TYPE_FILE);
    if (allowType && allowSize) {
      onSubmit?.(file);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const result = await uploadAxios.post<FormData, AxiosResponse<ImageItem>>(UPLOAD_FILE_URL, formData);
        if (result.data.file_url) {
          const url = result.data.file_url;
          const fileName = url.split("/").pop() || "";
          const fullPath = process.env.REACT_APP_BASE_URL + url;
          onSuccess({ url, fileName, fullPath });
        } else throw new Error("Upload failed");
      } catch (err: any) {
        const error = (err as AxiosError<any>)?.response?.data;
        const message =
          typeof error?.error.message === "string"
            ? error?.error.message
            : typeof error?.error.message?.[0] === "string"
            ? error.error.message[0]
            : "Upload failed";
        onError?.(message);
      }
    }
  };
  const required = rules?.find(item => (item as any)?.required);

  return (
    <Form.Item dependencies={[name]} noStyle>
      {({ getFieldValue, setFieldValue, setFieldsValue }) => {
        const value = getFieldValue(name);
        const fileList: UploadProps["fileList"] = multiple
          ? typeof multiple == "number"
            ? (value as string[])?.slice(0, multiple).map(item => ({
                uid: item,
                name: item.split("/").pop() || "",
                url: item,
                status: "done",
              }))
            : (value as string[])?.map(item => ({
                uid: item,
                name: item.split("/").pop() || "",
                url: item,
                status: "done",
              }))
          : value
          ? [{ uid: value, name: value?.split("/").pop() || "", url: value, status: "done" }]
          : [];
        return (
          <>
            <Form.Item
              className={`${styles.group} ${required ? styles.required : ""} ${className ?? ""}`}
              label={
                label && (
                  <div className={styles.label}>
                    {label}
                    <div className={styles.description}>
                      {"Click to upload SVG, PNG, JPG (max. 2MB)"}
                      <br />
                      {description}
                    </div>
                  </div>
                )
              }
              rules={rules}
              labelCol={{ span: 6 }}
            >
              <Upload
                key={fileList.length}
                className={`${styles.upload} ${square ? styles.square : ""} ${uploadClassName ?? ""}`}
                multiple={isSingle ? false : true}
                maxCount={!multiple ? 1 : multiple === true ? Infinity : multiple}
                listType="picture-card"
                customRequest={() => null}
                accept={ACCEPTEDS.join(",")}
                beforeUpload={handleUpload}
                fileList={fileList}
                {...uploadProps}
                showUploadList={{
                  removeIcon: file => (
                    <CustomIcon
                      disabled={disabled}
                      icon={TrashIcon}
                      width={20}
                      stroke="#F25A5A"
                      className={styles.delete}
                      title="Delete"
                      onClick={() => {
                        if (!disabled) {
                          setFieldValue?.(name, multiple ? value?.filter?.((item: string) => item !== file.url) : "");
                          setFieldsValue({});
                        }
                      }}
                    />
                  ),
                  showPreviewIcon: false,
                }}
              >
                {fileList.length < +(multiple || 1) && (
                  <CustomIcon icon={GalleryAddIcon} width={64} fill="currentColor" title={"Upload"} />
                )}
              </Upload>
            </Form.Item>
            <Form.Item name={name} rules={rules} className={styles.error}>
              <input type="hidden" />
            </Form.Item>
          </>
        );
      }}
    </Form.Item>
  );
};
export default ImageInput;
