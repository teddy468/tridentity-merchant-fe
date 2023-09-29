import { Button, Col, Form, message, Row } from "antd";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AttributeBox from "../../../commons/components/AttributeBox/AttributeBox";
import BorderGradientButton from "../../../commons/components/BorderGradientButton/BorderGradientButton";
import { CategorySelect } from "../../../commons/components/CategorySelect/CategorySelect";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import { CustomSelect } from "../../../commons/components/CustomSelect/CustomSelect";
import FormBox from "../../../commons/components/FormBox/FormBox";
import FormHeader from "../../../commons/components/FormHeader/FormHeader";
import GradientText from "../../../commons/components/GradientText/GradientText";
import ImageInput from "../../../commons/components/ImageInput/ImageInput";
import SelectAddMore from "../../../commons/components/SelectAddMore";
import TextArea from "../../../commons/components/TextArea/TextArea";
import VideoInput from "../../../commons/components/VideoInput/VideoInput";
import { UPDATE_PRODUCT_APPROVAL_URL } from "../../../commons/constants/api-urls";
import { MAIN_TAG_OPTIONS, ProductStatusEnum, TYPE_OF_ATTRIBUTE } from "../../../commons/constants/product";
import { navigations } from "../../../commons/constants/routers";
import defaultAxios from "../../../commons/utils/axios";
import {
  createNewAttribute,
  getBodyFromProductValues,
  getValuesFromProductDetail,
} from "../../../commons/utils/functions/productMapping";
import { isPositiveNumber, isPositiveNumberOrZero } from "../../../commons/utils/functions/validation";
import { AppContext } from "../../../contexts/AppContext";
import PreviewProduct from "../../PreviewProduct/PreviewProduct";
import styles from "./CreateUpdateProductForm.module.scss";
import { filterECharacterInputNumber } from "../../../commons/utils/functions/integerOnly";
import removeExtraSpace from "../../../commons/utils/functions/removeExtraSpace";
import CustomImageInput from "../../../commons/components/CustomImageInput/CustomImageInput";
import { uploadImageToServer } from "../../../commons/utils/functions/uploadImageToServer";

type Props = {
  product?: Product | null;
  approvalId?: number;
  approvalType?: string;
};

export enum ApprovalStatus {
  PENDING = 0,
  APPROVE = 1,
  REJECT = 2,
  DELETE = 3,
}

export enum ProductActionType {
  CREATE = "Create",
  UPDATE = "Update",
  PUBLISH = "Publish",
}

const CreateUpdateProductApprovalForm = ({ product, approvalId, approvalType }: Props) => {
  const { user, currentStore, configAttributes } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  // get current url to check if user is in create or update page

  const [form] = Form.useForm<CreateUpdateProductValues>();
  const [preview, setPreview] = useState<boolean>(false);
  const attr = Form.useWatch("attributes", form);
  const [loading, setLoading] = useState<"draft" | "save" | false>(false);
  const [productPreview, setProductPreview] = useState<CreateUpdateProductBody | null>(null);

  const isInApprovePage = useMemo(() => {
    return location.pathname.includes("approval");
  }, []);

  useEffect(() => {
    const attributes: CreateUpdateProductValues["attributes"] = form.getFieldValue("attributes");
    const requiredAttributes = attributes.filter(attribute =>
      attribute.type_of_attribute.includes(TYPE_OF_ATTRIBUTE.is_required)
    );
    if (requiredAttributes.length) {
      let price = 0;
      requiredAttributes.forEach(attribute => {
        let minVariantPrice = Number.MAX_SAFE_INTEGER;
        attribute.variants.forEach((variant: ProductVariationValues) => {
          if (Number(variant.price) < minVariantPrice) {
            minVariantPrice = Number(variant.price);
          }
        });
        price += minVariantPrice;
      });
      form.setFieldValue("price", price);
    }
  }, [attr, form]);

  useEffect(() => {
    form.setFieldsValue(getValuesFromProductDetail(product, currentStore?.id, configAttributes));
  }, [product, currentStore?.id, form, configAttributes]);

  const onFinish = async (values: CreateUpdateProductValues) => {
    if (approvalType === ProductActionType.UPDATE || approvalType === ProductActionType.CREATE) {
      setLoading("save");
      try {
        if (!currentStore) {
          message.error(`Please select store`);
          return;
        }
        const { images, videos } = values;
        const imageUrls = images.filter(image => typeof image === "string") as string[];
        const videoUrls = videos.filter(video => typeof video === "string") as string[];
        const newImages = images.filter(image => typeof image !== "string");
        const newVideos = videos.filter(video => typeof video !== "string");
        if (newImages) {
          await uploadImageToServer(newImages).then(res => {
            if (Array.isArray(res)) {
              res.forEach(item => imageUrls.push(item));
            } else {
              imageUrls.push(res);
            }
          });
        }

        if (newVideos) {
          await uploadImageToServer(newVideos).then(res => {
            if (Array.isArray(res)) {
              res.forEach(item => videoUrls.push(item));
            } else {
              videoUrls.push(res);
            }
          });
        }

        const body = {
          ...getBodyFromProductValues(values, currentStore.id),
          images: imageUrls,
          thumbnail: imageUrls[0],
          videos: videoUrls,
        };
        const realBody = {
          ...body,
          status: ProductStatusEnum.ACTIVE,
        };

        await defaultAxios.put(UPDATE_PRODUCT_APPROVAL_URL(approvalId ? approvalId : 0), {
          approval_status: ApprovalStatus.PENDING,
          update_product_dto: realBody,
        });

        message.success(`Update request  successfully`);
        navigate(navigations.STORES.PRODUCT_MANAGEMENT(currentStore.id.toString()));
      } catch (error: any) {
        message.error(`Update request failed`);
      }
      setLoading(false);
    }
  };
  const getActionBtn = useCallback(() => {
    if (isInApprovePage) return null;
    return (
      <>
        {" "}
        <Button type="text" className={styles.cancel} onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button
          type="text"
          className={styles.preview}
          onClick={() => {
            setProductPreview(getBodyFromProductValues(form.getFieldsValue()));
            setPreview(true);
          }}
        >
          <GradientText text="Preview" />
        </Button>
        {approvalType !== ProductActionType.PUBLISH && (
          <Button
            type="primary"
            htmlType="submit"
            className={styles.save}
            disabled={!!loading}
            loading={loading === "save"}
          >
            {loading ? "Saving" : "Save"}
          </Button>
        )}
      </>
    );
  }, [isInApprovePage]);
  const onFinishFailed = (errorInfo: any) => {
    const namePath = errorInfo.errorFields[0].name;
    form.getFieldInstance(namePath)?.focus();
  };
  return (
    <>
      <Form
        form={form}
        name="create-product"
        wrapperCol={{ span: 24 }}
        initialValues={getValuesFromProductDetail(product, user?.merchantIds?.[0])}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <FormHeader
          title={
            approvalType === ProductActionType.CREATE
              ? `Request create product: "${product?.name}"`
              : approvalType === ProductActionType.UPDATE
              ? `Request update product: "${product?.name}"`
              : `Request publish product: "${product?.name}"`
          }
          actions={getActionBtn()}
        />

        <FormBox title="Basic information">
          <CustomInput
            disabled={isInApprovePage}
            name="name"
            label="Product name"
            placeholder="Enter product name"
            onMouseMove={removeExtraSpace("name", form)}
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
            disabled={isInApprovePage}
            name="images"
            label="Product image"
            square
            multiple={10}
            description="Up to 10 images"
            onError={err => form?.setFields([{ name: "images", errors: [err] }])}
            rules={[{ required: true, message: "This field is required" }]}
            isEdit={product?.name ? true : false}
            form={form}
          />
          <VideoInput
            disabled={isInApprovePage}
            name="videos"
            label="Update Product video"
            onError={err => form?.setFields([{ name: "videos", errors: [err] }])}
            isEdit={product?.name ? true : false}
            form={form}
          />
          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <CategorySelect
                name="category_id"
                label="Product Category"
                rules={[{ required: true, message: "This field is required" }]}
                disabled={isInApprovePage}
              />
            </Col>
            <Col xs={24} sm={8}>
              <CustomSelect
                name="main_tags"
                label="Product Tag"
                options={MAIN_TAG_OPTIONS}
                placeholder="Product Main Tag"
                disabled={isInApprovePage}
              />
            </Col>
            <Col xs={24} sm={8}>
              <SelectAddMore
                product={product}
                name="sub_tags"
                label="Product Hashtag"
                placeholder="Product Hashtag"
                mode="multiple"
                disabled={isInApprovePage}
              />
            </Col>
          </Row>
          <TextArea
            name="description"
            label="Description"
            disabled={isInApprovePage}
            onMouseMove={removeExtraSpace("description", form)}
            placeholder="Tell us something about your product"
            rules={[
              {
                required: true,
                message: "This field is required",
                whitespace: true,
              },
            ]}
            showCount
            maxLength={3000}
          />
        </FormBox>
        <FormBox title="Selling information">
          <Form.Item dependencies={["attributes"]}>
            {({ getFieldValue }) => {
              const atrributes: CreateUpdateProductValues["attributes"] = getFieldValue("attributes");
              const isNoVariant = !atrributes?.length;
              const isNoRequiredAttribute = !atrributes.some(item =>
                item.type_of_attribute.includes(TYPE_OF_ATTRIBUTE.is_required)
              );
              const isRequired = isNoVariant || isNoRequiredAttribute;

              return (
                <Row gutter={24}>
                  <Col xs={24} sm={24}>
                    <CustomInput
                      name="price"
                      label="Product price"
                      placeholder="Product price"
                      readOnly={!isRequired}
                      rules={[
                        { required: true, message: "This field is required" },
                        { validator: isPositiveNumber("price") },
                      ]}
                      onKeyDown={event => {
                        if (event.key === "." || event.key === "-" || event.key === ",") {
                          event.preventDefault();
                        }
                      }}
                      onChange={event => filterECharacterInputNumber("price", form, event)}
                      disabled={isInApprovePage}
                    />
                  </Col>
                  {/* {isRequired && (
                    <Col xs={24} sm={12}>
                      <CustomInput
                        name="quantity"
                        label="Stock quantity"
                        placeholder="Stock quantity"
                        onKeyDown={event => {
                          if (event.key === "." || event.key === "-" || event.key === ",") {
                            event.preventDefault();
                          }
                        }}
                        rules={[
                          { required: true, message: "This field is required" },
                          { validator: isPositiveNumber("quantity") },
                        ]}
                        onChange={event => filterECharacterInputNumber("quantity", form, event)}
                        disabled={isInApprovePage}
                      />
                    </Col>
                  )} */}
                </Row>
              );
            }}
          </Form.Item>
          <Form.List name="attributes">
            {(attributes, { add, remove }: FormListOperationCustom<CreateUpdateProductValues["attributes"][0]>) => {
              return (
                <>
                  {attributes.map(({ key, name, ...restAttribute }) => {
                    return (
                      <AttributeBox
                        key={key}
                        attributeIndex={name}
                        restAttribute={restAttribute}
                        remove={remove}
                        disabled={isInApprovePage}
                      />
                    );
                  })}
                  <div
                    className={styles.addAttribute}
                    onClick={() => {
                      if (isInApprovePage) return;
                      add(createNewAttribute());
                    }}
                  >
                    <BorderGradientButton disabled={isInApprovePage}>
                      <GradientText text="Add more attribute" />
                    </BorderGradientButton>
                  </div>
                </>
              );
            }}
          </Form.List>
        </FormBox>
        <FormBox title="">
          <Row gutter={24}>
            <Col xs={24} sm={24}>
              <CustomInput
                disabled={isInApprovePage}
                name="lead_time"
                label="Lead time"
                placeholder="Lead time"
                suffix="minutes"
                rules={[
                  {
                    validator: isPositiveNumberOrZero("Lead time"),
                  },
                ]}
                onChange={event => filterECharacterInputNumber("lead_time", form, event)}
              />
            </Col>
          </Row>
        </FormBox>
      </Form>
      {productPreview && <PreviewProduct open={preview} onCancel={() => setPreview(false)} product={productPreview} />}
    </>
  );
};

export default CreateUpdateProductApprovalForm;
