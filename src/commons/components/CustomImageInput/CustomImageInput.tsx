import React, { ReactElement, useEffect, useState } from "react";
import styles from "./CustomImageInput.module.scss";
import { Form, FormInstance, FormItemProps, Image, Modal, Spin, UploadFile } from "antd";
import { getBase64 } from "../../utils/functions/getBase64";
import Upload, { RcFile, UploadProps } from "antd/es/upload";
import CustomIcon from "../CustomIcon/CustomIcon";
import { IMAGE_TYPE_ALLOW } from "../../constants";
import { RemoveIcon, GalleryAddIcon, PreviewIcon } from "../../resources";
import { IMAGE } from "../../constants/message";
import { LoadingOutlined } from "@ant-design/icons";
import { UploadFileStatus } from "antd/es/upload/interface";

interface Props extends Omit<UploadProps, "multiple"> {
  label: React.ReactNode;
  name: string;
  onError?: (err: string) => void;
  multiple?: boolean | number;
  square?: boolean;
  rules?: FormItemProps["rules"];
  uploadClassName?: string;
  description?: React.ReactNode;
  isSingle?: boolean;
  isEdit: boolean;
  isCheckRation?: boolean;
  form: FormInstance;
  setIsMatchRatio?: React.Dispatch<React.SetStateAction<boolean[]>>;
  isMatchRatio?: boolean[];
}

const { JPEG, JPG, PNG, SVG } = IMAGE_TYPE_ALLOW;
const ACCEPTEDS = [JPEG, JPG, PNG, SVG];

const antIcon = <LoadingOutlined style={{ fontSize: 36, color: "#fff" }} spin />;

const CustomImageInput: React.FC<Props> = props => {
  const {
    className,
    uploadClassName,
    onError,
    name,
    label,
    description,
    multiple,
    rules,
    square,
    isSingle = false,
    disabled = false,
    isEdit = false,
    form,
    isCheckRation = false,
    setIsMatchRatio,
    isMatchRatio = [],
    ...uploadProps
  } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileListForm, setFileListForm] = useState<File[]>([]);
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleDelete = async (file: UploadFile) => {
    if (typeof file === "string" || (isEdit && file.uid.includes("https://"))) {
      const idxOfFileDeleted = fileList.findIndex(item => item.uid === file.uid);
      const newFileList = fileList?.filter((item: any) => item.uid !== file.uid) || [];
      const newFileListForm = (form.getFieldValue([name])?.filter((item: any) => item !== file.name) as File[]) || [];
      setFileList(newFileList);
      setFileListForm(newFileListForm);
      if (isCheckRation) {
        handTestImgRationWhenEdit(idxOfFileDeleted);
      }
      form.setFieldValue([name], newFileListForm);
    } else {
      const idxOfFileDeleted = fileList.findIndex(item => item.uid === file.uid);
      const newFileList = fileList.filter(item => item.uid !== file.uid);
      const newFileListForm = fileListForm.filter((item: any) => item.uid !== file.uid) as File[];
      setFileList(newFileList);
      setFileListForm(newFileListForm);
      if (isCheckRation) {
        handTestImgRationWhenEdit(idxOfFileDeleted);
      }
      form.setFieldValue([name], newFileListForm);
    }
  };
  function handTestImgRationWhenEdit(idxOfImg: number) {
    setIsMatchRatio &&
      setIsMatchRatio(prev => {
        const newIsMatch = prev.filter((_, idx) => idx !== idxOfImg);
        if (newIsMatch.every(item => item === true)) {
          form.setFields([{ name: [name], errors: undefined }]);
        } else {
          onError?.(IMAGE.NOT_MATCH_RATIO);
          form.setFields([{ name: [name], errors: [IMAGE.NOT_MATCH_RATIO] }]);
        }
        return newIsMatch;
      });
  }
  function testImgRatio(file: any) {
    const img = document.createElement("img");
    img.classList.add("hide");
    img.src = URL.createObjectURL(file.originFileObj as any);
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const imgRation = Math.round((width / height) * 100) / 100;
      if (imgRation < 1.4 || imgRation > 1.6) {
        setIsMatchRatio?.(prev => [...prev, false]);
        onError?.(IMAGE.NOT_MATCH_RATIO);
        form.setFields([{ name: [name], errors: [IMAGE.NOT_MATCH_RATIO] }]);
      } else {
        setIsMatchRatio?.(prev => [...prev, true]);
      }

      if (isMatchRatio.length > 0 && !isMatchRatio.every(item => item === true)) {
        onError?.(IMAGE.NOT_MATCH_RATIO);
        form.setFields([{ name: [name], errors: [IMAGE.NOT_MATCH_RATIO] }]);
      }
    };
  }
  const handleChange = async ({ file, fileList: newFileList }: any) => {
    const { type, size } = file as UploadFile<File>;
    if (isCheckRation) {
      testImgRatio(file);
    }
    const allowType = ACCEPTEDS.includes(type || "");
    const allowSize = size && size < 1024 * 1024 * 2;
    if (!allowSize) onError?.(IMAGE.NOT_EXCEED_2MB);
    if (!allowType) onError?.(IMAGE.NOT_ALLOW_TYPE_FILE);
    if (allowType && allowSize) {
      form.setFields([{ name: [name], errors: undefined }]);
      setFileList(newFileList);
    }
  };

  const handleUpload = async (file: File, setFieldValue: any) => {
    setFileListForm(prev => [...prev, file]);
    if (name !== "logo") {
      setFieldValue([name], [...form.getFieldValue([name]), file]);
    } else {
      setFieldValue([name], file);
    }
  };

  const required = rules?.find(item => (item as any)?.required);

  useEffect(() => {
    if (isEdit) {
      const storeUploadFiles: string[] | string = form?.getFieldValue(name);
      if (Array.isArray(storeUploadFiles)) {
        const convertedArray: UploadFile[] = storeUploadFiles.map((fileUrl, index) => {
          const uploadFile = {
            uid: fileUrl,
            name: fileUrl,
            status: "done" as UploadFileStatus,
            url: fileUrl,
            thumbUrl: fileUrl,
          };
          return uploadFile;
        });
        console.log(storeUploadFiles);
        setFileList(convertedArray);
        form.setFieldValue([name], [...storeUploadFiles]);
      } else {
        setFileList([
          {
            uid: storeUploadFiles,
            name: storeUploadFiles,
            status: "done" as UploadFileStatus,
            url: storeUploadFiles,
            thumbUrl: storeUploadFiles,
          },
        ]);
        form.setFieldValue([name], [storeUploadFiles]);
      }
    }
  }, [isEdit, form, name]);

  return (
    <Form.Item dependencies={[name]} noStyle>
      {({ setFieldValue }) => {
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
                disabled={disabled}
                key={fileList.length}
                className={`${styles.upload} ${square ? styles.square : ""} ${uploadClassName ?? ""}`}
                multiple={isSingle ? false : true}
                maxCount={!multiple ? 1 : multiple === true ? Infinity : multiple}
                listType="picture-card"
                accept={ACCEPTEDS.join(",")}
                beforeUpload={(file: File) => {
                  handleUpload(file, setFieldValue);
                }}
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                {...uploadProps}
                itemRender={(originNode: ReactElement, file: UploadFile) => {
                  return (
                    <>
                      <div className={`${styles.pictureRender} ${square ? `${styles.square}` : `${styles.upload}`}`}>
                        <div className={styles.actions}>
                          <div className={styles.actionIcon} onClick={() => handlePreview(file)}>
                            <PreviewIcon />
                          </div>
                          <div
                            className={styles.actionIcon}
                            onClick={() => {
                              if (!disabled) handleDelete(file);
                            }}
                          >
                            <RemoveIcon />
                          </div>
                        </div>
                        {(file.status === "done" && (
                          <Image src={file.thumbUrl} height={"100%"} width={"100%"} preview={false} />
                        )) || <Image src={file.thumbUrl} height={"100%"} width={"100%"} preview={false} /> || (
                            <Spin indicator={antIcon} />
                          )}
                      </div>
                    </>
                  );
                }}
              >
                {fileList.length < +(multiple || 1) && (
                  <CustomIcon icon={GalleryAddIcon} width={64} fill="currentColor" title={"Upload"} />
                )}
              </Upload>
            </Form.Item>
            <Modal open={previewOpen} footer={null} onCancel={handleCancel} centered={true} width={720}>
              <img alt="imgPreview" style={{ width: "100%", height: "100%" }} src={previewImage} />
            </Modal>
            <Form.Item name={name} rules={rules} className={styles.error}>
              <input type="hidden" />
            </Form.Item>
          </>
        );
      }}
    </Form.Item>
  );
};

export default CustomImageInput;
