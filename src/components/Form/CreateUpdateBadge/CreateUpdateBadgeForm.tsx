import { Button, Col, DatePicker, Form, message, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import FormBox from "../../../commons/components/FormBox/FormBox";
import FormHeader from "../../../commons/components/FormHeader/FormHeader";
import TextArea from "../../../commons/components/TextArea/TextArea";
import { BADGE_DETAIl_URL, BADGE_MANAGEMENT_URL } from "../../../commons/constants/api-urls";
import { BadgeStatusEnum } from "../../../commons/constants/product";
import { navigations } from "../../../commons/constants/routers";
import defaultAxios from "../../../commons/utils/axios";
import styles from "./CreateUpdateBadgeForm.module.scss";
import CustomImageInput from "../../../commons/components/CustomImageInput/CustomImageInput";
import { uploadImageToServer } from "../../../commons/utils/functions/uploadImageToServer";

type Props = {
  storeId: string;
};

const CreateUpdateBadgeForm = ({ storeId }: Props) => {
  const navigate = useNavigate();
  const { badgeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [badgeDetail, setBadgeDetail] = useState({
    id: 0,
    name: "",
    image: "",
    supply: "",
    description: "",
    status: -1,
    end_date: "",
    start_date: "",
  });
  const [form] = Form.useForm<any>();

  const isDisable = badgeDetail.status === BadgeStatusEnum.ACTIVE;
  const initialValues = useMemo(() => {
    return badgeDetail?.id > 0
      ? {
          name: badgeDetail.name,
          images: [badgeDetail.image],
          supply: badgeDetail.supply,
          description: badgeDetail.description,
          start_date: dayjs(badgeDetail.start_date),
          end_date: dayjs(badgeDetail.end_date),
        }
      : {
          name: "",
          images: [],
          supply: "",
          description: "",
        };
  }, [badgeDetail]);

  useEffect(() => {
    setTimeout(() => {
      form.setFieldsValue(initialValues);
    }, 500);
  }, [initialValues, form]);

  useEffect(() => {
    if (badgeId) {
      getBadgeDetail();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badgeId]);

  const getBadgeDetail = async () => {
    setLoading(true);
    try {
      const res = await defaultAxios.get(BADGE_DETAIl_URL(badgeId as string));
      setBadgeDetail(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const onFinish = async (values: CreateUpdateProductValues, isDraft?: boolean) => {
    try {
      const { images } = values;

      const imageUrls = images.filter((image: any) => typeof image === "string") as string[];
      const newImages = images.filter((image: any) => typeof image !== "string");
      if (newImages) {
        await uploadImageToServer(newImages).then(res => {
          if (Array.isArray(res)) {
            res.forEach(item => imageUrls.push(item));
          } else {
            imageUrls.push(res);
          }
        });
      }

      let body = {
        ...values,
        image: imageUrls[0],
        status: isDraft ? BadgeStatusEnum.DRAFT : BadgeStatusEnum.ACTIVE,
      };

      if (badgeDetail.id && badgeDetail.id > 0) {
        body = {
          ...body,
          id: badgeDetail.id,
        };
      }
      const res = await defaultAxios.post<any>(BADGE_MANAGEMENT_URL(storeId), { ...body });
      if (!res.data) throw res;
      let messageContent = badgeId && Number(badgeId) > 0 ? "Update badge successfuly" : `Create badge successfuly`;
      message.success(messageContent);
      navigate(navigations.STORES.BADGE_MANAGEMENT(storeId));
    } catch (error: any) {
      console.error(error);
      message.error(`Create product failed`);
    }
  };

  return (
    <>
      {!loading && (
        <Form
          form={form}
          name="create-product"
          wrapperCol={{ span: 24 }}
          initialValues={initialValues}
          onFinish={onFinish}
          onError={e => console.log(e)}
          autoComplete="off"
        >
          <FormHeader
            title={badgeDetail?.id > 0 ? "Badge details" : "Create new Badge"}
            actions={
              <>
                <Button type="text" className={styles.cancel} onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                {badgeDetail?.id > 0 && badgeDetail.status === BadgeStatusEnum.ACTIVE ? null : (
                  <>
                    <Button
                      type="default"
                      disabled={isDisable}
                      itemType=""
                      className={styles.draft}
                      onClick={() => onFinish(form.getFieldsValue(), true)}
                    >
                      Save as draft
                    </Button>
                    <Button type="primary" disabled={isDisable} htmlType="submit" className={styles.save}>
                      Save & Publish
                    </Button>
                  </>
                )}
              </>
            }
          />

          <FormBox title="Badge information">
            <CustomInput
              name="name"
              label="Badge name"
              placeholder="Enter your Badge name"
              disabled={isDisable}
              rules={[
                {
                  required: true,
                  message: "This field is required",
                  whitespace: true,
                },
              ]}
              maxLength={120}
            />

            <CustomImageInput
              disabled={isDisable}
              name="images"
              label="Badge image"
              square
              isSingle={true}
              multiple={1}
              onError={err => form?.setFields([{ name: "images", errors: [err] }])}
              rules={[{ required: true, message: "This field is required" }]}
              isEdit={badgeId ? true : false}
              form={form}
            />

            <Row gutter={24}>
              <Col xs={24} sm={24}>
                <CustomInput
                  disabled={isDisable}
                  placeholder="Enter your Supply name"
                  label="Supply"
                  name="supply"
                  rules={[{ required: true, message: "This field is required", whitespace: true }]}
                  maxLength={120}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Start date"
                  name={"start_date"}
                  rules={[{ type: "object" as const, required: true, message: "This field is required" }]}
                  className={`${styles.group} ${styles.label}`}
                  labelCol={{ span: 24 }}
                >
                  <DatePicker
                    disabled={isDisable}
                    format={"DD/MM/YYYY"}
                    popupClassName="picker"
                    style={{ background: "transparent" }}
                    disabledDate={current => {
                      if (form.getFieldValue("end_date")) {
                        return (
                          dayjs(form.getFieldValue("end_date")).add(0, "days") <= current ||
                          dayjs().add(-1, "days") >= current
                        );
                      } else {
                        return dayjs().add(-1, "days") >= current;
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="End date"
                  name={"end_date"}
                  rules={[{ type: "object" as const, required: true, message: "This field is required" }]}
                  className={`${styles.group} ${styles.label}`}
                  labelCol={{ span: 24 }}
                >
                  <DatePicker
                    disabled={isDisable}
                    format={"DD/MM/YYYY"}
                    style={{ background: "transparent" }}
                    disabledDate={current => {
                      if (form.getFieldValue("start_date")) {
                        return form.getFieldValue("start_date") >= current;
                      }else{
                        return dayjs().add(-1, "days") >= current;
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <TextArea
              name="description"
              label="Description"
              disabled={isDisable}
              placeholder="Tell us something about your product"
              rules={[
                {
                  required: true,
                  message: "This field is required",
                  whitespace: true,
                },
              ]}
              showCount
              maxLength={300}
            />
          </FormBox>
        </Form>
      )}
    </>
  );
};

export default CreateUpdateBadgeForm;
