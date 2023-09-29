import { Col, Form, Row, Spin } from "antd";
import { AxiosError } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import BorderGradientButton from "../../commons/components/BorderGradientButton/BorderGradientButton";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import CustomModal from "../../commons/components/CustomModal/CustomModal";
import { CustomSelect } from "../../commons/components/CustomSelect/CustomSelect";
import GradientText from "../../commons/components/GradientText/GradientText";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import {
  MERCHANTS_PRODUCTS_URL,
  MERCHANT_CAMPAIGN_DETAIL_ALLOCATION,
  MERCHANT_CAMPAIGN_PRODUCTS,
  PUT_MERCHANT_CAMPAIGN_PRODUCTS,
} from "../../commons/constants/api-urls";
import useFetch from "../../commons/hooks/useFetch";
import useFetchList from "../../commons/hooks/useFetchList";
import useToast from "../../commons/hooks/useToast";
import defaultAxios from "../../commons/utils/axios";
import { formatLP } from "../../commons/utils/functions/formatPrice";
import { Product } from "./detail";
import "./index.scss";
import styles from "./product-management.module.scss";
import { filterECharacterInputNumber, integerOnlyInput } from "../../commons/utils/functions/integerOnly";
import { LETTER_REGEX } from "../../commons/constants";

interface ModalCreateCampaignProps {
  openModal: boolean;
  editedProduct: Product | undefined;
  onCancel: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
  storeId: number;
  campaignId: number;
  lpAmount: number;
  productData?: {
    key: React.Key;
    name: string;
    product_id: number;
    id: number;
    total_lp: number;
    single_lp: number;
    status: string;
    product: Product;
  }[];
}

export const ModalCreateProduct = (props: ModalCreateCampaignProps) => {
  const { openModal, onCancel, onSuccess, storeId, campaignId, lpAmount, editedProduct, productData } = props;

  const [form] = Form.useForm<any>();
  const toast = useToast();

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editedProduct) {
      form.setFieldsValue(editedProduct);
    } else {
      form.resetFields();
    }
  }, [editedProduct, form]);

  function handleCancel() {
    onCancel(false);
    form.resetFields();
  }
  const onFinish = async () => {
    form
      .validateFields()
      .then(async values => {
        if (!editedProduct) {
          const body = {
            product_id: values["product_id"],
            single_lp_amount: Number(values["single_lp_amount"]),
            lp_amount: Number(values["lp_amount"]),
            status: 1,
          };
          try {
            setUploading(true);
            await defaultAxios.post(MERCHANT_CAMPAIGN_PRODUCTS(campaignId), body);
            toast.success("Create product success");
            form.resetFields();
            onSuccess();
            onCancel(false);
            setUploading(false);
          } catch (err) {
            setUploading(false);
            const error = (err as AxiosError<any>)?.response?.data;
            const message =
              typeof error?.error.message === "string"
                ? error?.error.message
                : typeof error?.error.message?.[0] === "string"
                ? error.error.message[0]
                : "Request Fail";
            toast.error(message);
            return "";
          }
        } else {
          const body = {
            single_lp_amount: Number(values["single_lp_amount"]),
            lp_amount: Number(values["lp_amount"]),
            status: 1,
          };
          try {
            setUploading(true);
            await defaultAxios.put(PUT_MERCHANT_CAMPAIGN_PRODUCTS(campaignId, editedProduct.product_id), body);
            toast.success("Update product success");
            onSuccess();
            onCancel(false);
            setUploading(false);
          } catch (err) {
            setUploading(false);
            const error = (err as AxiosError<any>)?.response?.data;
            const message =
              typeof error?.error.message === "string"
                ? error?.error.message
                : typeof error?.error.message?.[0] === "string"
                ? error.error.message[0]
                : "Request Fail";
            toast.error(message);
            return "";
          }
        }
      })
      .catch(errorInfo => {
        console.error({ errorInfo });
      });
  };
  const params = { page: 0, perPage: 1000, paginationMetadataStyle: "body" };

  const { data: products } = useFetchList<ProductItem>(storeId ? MERCHANTS_PRODUCTS_URL(storeId) : "", {
    ...params,
    sort_by: "create_time",
    order_by: "DESC",
  });

  const productOptions = useMemo(() => {
    if (products && productData) {
      return products
        .filter(item => {
          const idx = productData?.findIndex(data => data.name === item.name);
          if (idx < 0) {
            return true;
          } else {
            return false;
          }
        })
        .map(product => ({
          value: product.id,
          label: product.name + " - " + product.id,
        }));
    }
    return [];
  }, [products, productData]);

  const { data: allocationLP, refresh: refreshAllocation } = useFetch<{ total_allocation: number }>(
    MERCHANT_CAMPAIGN_DETAIL_ALLOCATION(campaignId)
  );

  useEffect(() => {
    if (openModal) {
      refreshAllocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);
  const lp_amount = Form.useWatch("lp_amount", form);
  const single_lp_amount = Form.useWatch("single_lp_amount", form);
  useEffect(() => {
    const inputLpAmount = form.getFieldValue("lp_amount");
    const inputSingleLpAmount = form.getFieldValue("single_lp_amount");
    if (inputSingleLpAmount > inputLpAmount) {
      // set error for input single lp amount
      form.setFields([
        {
          name: "single_lp_amount",
          errors: ["Single LP amount must be less than LP amount"],
        },
      ]);
    } else {
      form.setFields([
        {
          name: "single_lp_amount",
          errors: [],
        },
      ]);
    }
  }, [lp_amount, single_lp_amount, form]);
  return (
    <CustomModal
      maskClosable={false}
      footer={
        <div className={styles.groupButton}>
          <Row style={{ width: "100%" }}>
            <Col span={12}>
              <BorderGradientButton style={{ width: "90%", marginBottom: 0 }} onClick={handleCancel}>
                <GradientText text="Cancel" />
              </BorderGradientButton>
            </Col>
            <Col span={12}>
              <PrimaryButton style={{ width: "90%", marginLeft: "10%" }} onClick={onFinish}>
                {editedProduct ? "Edit product" : "Add product"}
              </PrimaryButton>
            </Col>
          </Row>
        </div>
      }
      title={editedProduct ? "Edit product" : "Add product"}
      open={openModal}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        name="create-campaign"
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        onError={e => console.log(e)}
        autoComplete="off"
      >
        {uploading && (
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        )}
        <Row>
          <Col span={24}>
            <CustomSelect
              disabled={editedProduct !== undefined}
              placeholder="Please select product"
              name="product_id"
              label="Product"
              rules={[{ required: true, message: "This field is required" }]}
              options={productOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <CustomInput
              label={
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div>LP amount</div>
                  <div style={{ fontWeight: 500, fontSize: 14, lineHeight: "20px", color: "#FFFFFF" }}>
                    Remaining LP:{" "}
                    <span style={{ color: "#12B76A" }}>
                      {formatLP(lpAmount - (allocationLP ? allocationLP.total_allocation : 0)) || 0}
                    </span>
                  </div>
                </div>
              }
              onChange={event => {
                filterECharacterInputNumber("lp_amount", form, event);
              }}
              type="number"
              isCustom
              name={"lp_amount"}
              onKeyDown={integerOnlyInput}
              placeholder="Enter amount"
              rules={[
                { pattern: /^\d+(\.\d+)?$/, message: "Input number only" },
                {
                  required: true,
                  message: "This field is required",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (editedProduct !== undefined) {
                      return Promise.resolve();
                    }
                    const max = lpAmount - (allocationLP ? allocationLP.total_allocation : 0);
                    if (value && Number(value) <= 0) {
                      return Promise.reject(new Error("Amount must be greater than 0"));
                    }
                    if (value && Number(value) > max) {
                      return Promise.reject(new Error("Insufficient amount"));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <CustomInput
              placeholder="LP amount for each product"
              label="LP amount for each product"
              name={"single_lp_amount"}
              onKeyDown={integerOnlyInput}
              type="number"
              onChange={event => {
                filterECharacterInputNumber("single_lp_amount", form, event);
              }}
              rules={[
                { pattern: /^\d+(\.\d+)?$/, message: "Input number only" },
                {
                  required: true,
                  message: "This field is required",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const max = getFieldValue("lp_amount");
                    if (value && max && Number(value) > Number(max)) {
                      return Promise.reject(
                        new Error("LP amount for each product should be smaller than total LP amount")
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            />
          </Col>
        </Row>
      </Form>
    </CustomModal>
  );
};

export default ModalCreateProduct;
