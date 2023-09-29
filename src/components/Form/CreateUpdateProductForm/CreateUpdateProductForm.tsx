import { Button, Col, Form, message, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AttributeBox from "../../../commons/components/AttributeBox/AttributeBox";
import BorderGradientButton from "../../../commons/components/BorderGradientButton/BorderGradientButton";
import { CategorySelect } from "../../../commons/components/CategorySelect/CategorySelect";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import { CustomSelect } from "../../../commons/components/CustomSelect/CustomSelect";
import FormBox from "../../../commons/components/FormBox/FormBox";
import FormHeader from "../../../commons/components/FormHeader/FormHeader";
import GradientText from "../../../commons/components/GradientText/GradientText";
import SelectAddMore from "../../../commons/components/SelectAddMore";
import TextArea from "../../../commons/components/TextArea/TextArea";
import VideoInput from "../../../commons/components/VideoInput/VideoInput";
import { MAIN_TAG_OPTIONS, ProductStatusEnum, TYPE_OF_ATTRIBUTE } from "../../../commons/constants/product";
import {
  createNewAttribute,
  getBodyFromProductValues,
  getValuesFromProductDetail,
} from "../../../commons/utils/functions/productMapping";
import { AppContext } from "../../../contexts/AppContext";
import PreviewProduct from "../../PreviewProduct/PreviewProduct";
import styles from "./CreateUpdateProductForm.module.scss";
import { isPositiveNumber, isPositiveNumberOrZero } from "../../../commons/utils/functions/validation";
import {
  decimalOnlyInput,
  filterECharacterInputDecimal,
  filterECharacterInputNumber,
  integerOnlyInput,
} from "../../../commons/utils/functions/integerOnly";
import CustomImageInput from "../../../commons/components/CustomImageInput/CustomImageInput";
import { uploadImageToServer } from "../../../commons/utils/functions/uploadImageToServer";
import defaultAxios from "../../../commons/utils/axios";
import removeExtraSpace from "../../../commons/utils/functions/removeExtraSpace";

import { CREATE_PRODUCT_DRAFT_URL, CREATE_PRODUCT_URL, UPDATE_PRODUCT_URL } from "../../../commons/constants/api-urls";
import { navigations } from "../../../commons/constants/routers";
import {
  format2Digit,
  format2DigitValueForm,
  roundedAndFormatNumber,
} from "../../../commons/utils/functions/formatPrice";

type Props = {
  product?: Product | null;
};

const CreateUpdateProductForm = ({ product }: Props) => {
  const { user, currentStore, configAttributes } = useContext(AppContext);
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateUpdateProductValues>();
  const [preview, setPreview] = useState<boolean>(false);
  const [isMatchRatio, setIsMatchRatio] = useState<boolean[]>([]);
  const attr = Form.useWatch("attributes", form);
  const [loading, setLoading] = useState<"draft" | "save" | false>(false);
  const [productPreview, setProductPreview] = useState<CreateUpdateProductBody | null>(null);
  const oldStatus: number | undefined = product ? product.status : undefined;
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

  async function editDraftProduct(body: CreateUpdateProductBody) {
    try {
      const realBody = {
        ...body,
        status: ProductStatusEnum.DRAFT,
      };
      await defaultAxios.put<CreateUpdateProductResponse>(UPDATE_PRODUCT_URL((product as any)?.id), realBody);
      message.success(`Update draft product successfully`);
    } catch (error) {
      message.error(`Update draft product failed`);
    }
  }
  async function editActiveProduct(body: CreateUpdateProductBody) {
    try {
      const realBody = {
        ...body,
        status: oldStatus,
      };
      await defaultAxios.put<CreateUpdateProductResponse>(UPDATE_PRODUCT_URL((product as any)?.id), realBody);
      if (oldStatus === ProductStatusEnum.ACTIVE) {
        message.success("Wait admin approval your request !");
      } else {
        message.success(`Update product successfully`);
      }
    } catch (error) {
      message.error(`Update product failed`);
    }
  }
  async function createNewProduct(body: CreateUpdateProductBody) {
    try {
      const realBody = {
        ...body,
        status: ProductStatusEnum.ACTIVE,
      };
      // create new change
      await defaultAxios.post<CreateUpdateProductResponse>(CREATE_PRODUCT_URL, realBody);
      message.success("Wait admin approval your request !");
    } catch (error) {
      message.error(` Create product failed`);
    }
  }
  async function createNewDraftProduct(body: CreateUpdateProductBody) {
    try {
      const realBody = {
        ...body,
        status: ProductStatusEnum.DRAFT,
      };
      await defaultAxios.post<CreateUpdateProductResponse>(CREATE_PRODUCT_DRAFT_URL, realBody);
      message.success(`Create new draft product successfully`);
    } catch (error) {
      message.error(`Save draft product failed`);
    }
  }
  const onFinish = async (values: CreateUpdateProductValues, isDraft?: boolean) => {
    setLoading(isDraft ? "draft" : "save");
    const { images, videos } = values;
    const imageUrls = images.filter(image => typeof image === "string") as string[];
    const videoUrls = videos.filter(video => typeof video === "string") as string[];
    const newImages = images.filter(image => typeof image !== "string" && !Array.isArray(image));
    const newVideos = videos.filter(video => typeof video !== "string" && !Array.isArray(video));

    if (newImages) {
      try {
        await uploadImageToServer(newImages).then(res => {
          if (Array.isArray(res)) {
            res.forEach(item => imageUrls.push(item));
          } else {
            imageUrls.push(res);
          }
        });
      } catch (error) {
        setLoading(false);
        message.error("Upload image failed");
      }
    }

    if (newVideos) {
      try {
        await uploadImageToServer(newVideos).then(res => {
          if (Array.isArray(res)) {
            res.forEach(item => videoUrls.push(item));
          } else {
            videoUrls.push(res);
          }
        });
      } catch (error) {
        setLoading(false);
        message.error("Upload video failed");
      }
    }

    try {
      if (!currentStore) {
        message.error(`Please select store`);
        return;
      }
      const body: CreateUpdateProductBody = {
        ...getBodyFromProductValues(values, currentStore.id),
        images: imageUrls,
        thumbnail: imageUrls[0],
        videos: videoUrls,
      };
      const isEdit = Number(product?.id) > 0;

      if (isEdit) {
        // edit to draft => no change

        if (isDraft) {
          editDraftProduct(body);
        } else {
          // Edit active product => need approval
          editActiveProduct(body);
        }
      } else {
        // create new change
        if (isDraft) {
          createNewDraftProduct(body);
        } else {
          createNewProduct(body);
        }
      }
      navigate(navigations.STORES.PRODUCT_MANAGEMENT(currentStore.id.toString()));
    } catch (error: any) {
      message.error(`${product?.id ? "Update" : "Create"} product failed`);
    }
    setLoading(false);
  };

  const onDraft = async () => {
    setLoading("draft");
    try {
      const values = await form.validateFields();
      onFinish(values, true);
    } catch (error) {
      onFinishFailed(error);
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    const namePath = errorInfo.errorFields[0].name;
    form.getFieldInstance(namePath)?.focus();
  };

  const price = Form.useWatch("price", form);
  const attribute = Form.useWatch("attributes", form);

  useEffect(() => {
    if (!price) return;
    const priceAfterDecimal = price.toString().split(".");
    if (priceAfterDecimal[1]?.length > 2) {
      form.setFieldValue("price", (Math.round(Number(price) * 100) / 100).toFixed(2));
    }
  }, [attribute, price, form]);

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
          title={product?.name ?? "Create new product"}
          actions={
            <>
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
              {oldStatus !== ProductStatusEnum.DRAFT && (
                <Button
                  type="default"
                  itemType=""
                  className={styles.draft}
                  onClick={onDraft}
                  disabled={!!loading}
                  loading={loading === "draft"}
                >
                  {loading ? "Saving" : "Save"} as draft
                </Button>
              )}
              <Button
                type="primary"
                htmlType="submit"
                className={styles.save}
                disabled={!!loading}
                loading={loading === "save"}
              >
                {loading ? "Saving" : "Save"}
              </Button>
            </>
          }
        />

        <FormBox title="Basic information">
          <CustomInput
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
            name="images"
            label="Product image"
            square
            multiple={10}
            description="Up to 10 images, image aspect ratio must be 3:2"
            onError={err => form?.setFields([{ name: "images", errors: [err] }])}
            setIsMatchRatio={setIsMatchRatio}
            isMatchRatio={isMatchRatio}
            rules={[
              { required: true, message: "This field is required" },
              {
                validator: (_, value) => {
                  if (isMatchRatio.every(item => item === true)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Image aspect ratio must be 3:2");
                  }
                },
              },
            ]}
            isEdit={product?.id ? true : false}
            form={form}
            isCheckRation={true}
          />
          <VideoInput
            name="videos"
            label="Update Product video"
            onError={err => form?.setFields([{ name: "videos", errors: [err] }])}
            isEdit={product?.id ? true : false}
            form={form}
          />
          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <CategorySelect
                name="category_id"
                label="Product Category"
                rules={[{ required: true, message: "This field is required" }]}
              />
            </Col>
            <Col xs={24} sm={8}>
              <CustomSelect
                name="main_tags"
                label="Product Tag"
                options={MAIN_TAG_OPTIONS}
                placeholder="Product Main Tag"
              />
            </Col>
            <Col xs={24} sm={8}>
              <SelectAddMore
                product={product}
                name="sub_tags"
                label="Product Hashtag"
                placeholder="Product Hashtag"
                mode="multiple"
              />
            </Col>
          </Row>
          <TextArea
            name="description"
            label="Description"
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
                        decimalOnlyInput(event);
                      }}
                      onChange={event => {
                        filterECharacterInputDecimal("price", form, event);
                      }}
                    />
                  </Col>
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
                      <AttributeBox key={key} attributeIndex={name} restAttribute={restAttribute} remove={remove} />
                    );
                  })}
                  <div className={styles.addAttribute} onClick={() => add(createNewAttribute())}>
                    <BorderGradientButton>
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

export default CreateUpdateProductForm;
