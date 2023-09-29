import React, { useEffect, useState } from "react";
import { Col, Form, FormInstance, FormItemProps, Row, Upload, UploadFile, UploadProps } from "antd";
import { VIDEO } from "../../constants/message";
import { IMAGE_TYPE_ALLOW } from "../../constants";
import styles from "./VideoInput.module.scss";
import CustomIcon from "../CustomIcon/CustomIcon";
import { VideoAddIcon, RemoveIcon } from "../../resources";
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
  isEdit: boolean;
  form: FormInstance;
}

const { MP4 } = IMAGE_TYPE_ALLOW;
const ACCEPTEDS = [MP4];

const VideoInput: React.FC<Props> = props => {
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
    isEdit,
    form,
    ...uploadProps
  } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileListForm, setFileListForm] = useState<File[]>([]);

  const handleChange = async ({ file, fileList }: any) => {
    const { type, size } = file;

    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file.originFileObj);
    const allowType = ACCEPTEDS.includes(type);
    const allowSize = size < 1024 * 1024 * 30;
    if (!allowSize) onError?.(VIDEO.NOT_EXCEED_30MB);
    if (!allowType) onError?.(VIDEO.NOT_ALLOW_TYPE_FILE);
    if (allowType && allowSize) {
      video.onloadedmetadata = async () => {
        if (video.duration < 10 || video.duration > 60) {
          onError?.(VIDEO.DURATION);
        } else if (video.videoWidth > 1280 || video.videoHeight > 1280) {
          onError?.(VIDEO.NOT_EXCEED_RESOLUTION_1280);
        } else {
          form.setFields([{ name: [name], errors: undefined }]);
          const newFileList = fileList.map((file: any) => ({
            ...file,
            url: URL.createObjectURL(file.originFileObj),
          }));

          setFileList(newFileList);
        }
      };
    }
  };

  const handleUpload = async (file: File, setFieldValue: any) => {
    setFileListForm([...fileListForm, file]);
    setFieldValue([name], [...fileListForm, file]);
  };

  const handleDelete = async (file: UploadFile) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    const newFileListForm = fileListForm.filter(item => item.name !== file.name);
    setFileList(newFileList);
    setFileListForm(newFileListForm);
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

        setFileList(convertedArray);
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
      }
    }
  }, [isEdit, form, name]);

  return (
    <Form.Item dependencies={[name]} noStyle>
      {({ setFieldValue }) => {
        return (
          <Row gutter={1}>
            <Col span={24}>
              <Form.Item
                className={`${styles.group} ${required ? styles.required : ""} ${className ?? ""}`}
                label={label && <div className={styles.label}>{label}</div>}
                rules={rules}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                extra={
                  <ul className={styles.description}>
                    <li>Video size: maximum 30mb, resolution maximum 1280x1280px </li>
                    <li>Video length: 10-60s </li>
                    <li>Video format: mp4</li>
                  </ul>
                }
              >
                <Upload
                  key={fileList.length}
                  className={`${styles.upload} ${square ? styles.square : ""} ${uploadClassName ?? ""}`}
                  multiple={!!multiple}
                  maxCount={!multiple ? 1 : multiple === true ? Infinity : multiple}
                  listType="picture-card"
                  customRequest={() => null}
                  accept={ACCEPTEDS.join(",")}
                  beforeUpload={file => handleUpload(file, setFieldValue)}
                  onChange={handleChange}
                  fileList={fileList}
                  {...uploadProps}
                  showUploadList={true}
                  itemRender={(originNode, file, currFileList) => {
                    return currFileList.map(video => (
                      <div className={styles.videoWrapper} key={video.name}>
                        <video className={styles.thumbnail} controls>
                          <source src={video.url} />
                        </video>
                        <div className={styles.remove} onClick={() => handleDelete(file)}>
                          <RemoveIcon />
                        </div>
                      </div>
                    ));
                  }}
                >
                  {fileList.length < +(multiple || 1) && (
                    <CustomIcon icon={VideoAddIcon} width={64} fill="currentColor" title={"Upload"} />
                  )}
                </Upload>
              </Form.Item>
              <Form.Item name={name} rules={rules} className={styles.error}>
                <input type="hidden" />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
        );
      }}
    </Form.Item>
  );
};
export default VideoInput;
