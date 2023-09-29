import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Row, Spin } from "antd";
import { AxiosError } from "axios/index";
import dayjs from "dayjs";
import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import CustomModal from "../../commons/components/CustomModal/CustomModal";
import { CustomSelect } from "../../commons/components/CustomSelect/CustomSelect";
import GradientText from "../../commons/components/GradientText/GradientText";
import {
  CREATE_MERCHANT_CAMPAIGN,
  LP_POINT,
  MERCHANTS_PRODUCTS_URL,
  UPDATE_MERCHANT_CAMPAIGN,
} from "../../commons/constants/api-urls";
import useFetch from "../../commons/hooks/useFetch";
import useFetchList from "../../commons/hooks/useFetchList";
import useToast from "../../commons/hooks/useToast";
import { TrashIcon } from "../../commons/resources";
import defaultAxios from "../../commons/utils/axios";
import { formatLP } from "../../commons/utils/functions/formatPrice";
import { AppContext } from "../../contexts/AppContext";
import { Campaign } from "./index";
import "./index.scss";
import styles from "./product-management.module.scss";
import removeExtraSpace from "../../commons/utils/functions/removeExtraSpace";
import { filterECharacterInputNumber, integerOnlyInput } from "../../commons/utils/functions/integerOnly";
import { LETTER_REGEX } from "../../commons/constants";

interface ModalCreateCampaignProps {
  openModal: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editedCampaign: Campaign | undefined;
}

export const ModalCreateCampaign = (props: ModalCreateCampaignProps) => {
  const { openModal, onCancel, onSuccess, editedCampaign } = props;
  const [form] = Form.useForm<any>();
  const toast = useToast();

  const { data: lp, refresh: refreshLP } = useFetch<{ total_point: number }>(LP_POINT);

  const prepareFormValue = (campaign: Campaign) => {
    return {
      name: campaign.name,
      store_id: campaign.merchant_store_id,
      lp_amount: campaign.lp_amount,
      start_date: dayjs(campaign.start_date),
      end_date: dayjs(campaign.end_date),
    };
  };

  useEffect(() => {
    if (editedCampaign) {
      form.setFieldsValue(prepareFormValue(editedCampaign));
    } else {
      form.resetFields();
    }
  }, [editedCampaign, openModal, form]);

  const clearProduct = () => {
    form.setFieldsValue({ products: [] });
    setDisableAddProduct(false);
  };

  const handleOnChangeAmount = (event: ChangeEvent<HTMLInputElement>, name: string) => {
    filterECharacterInputNumber(name, form, event);
    clearProduct();
  };

  const onFinish = (isDraft: boolean) => {
    form
      .validateFields()
      .then(async values => {
        const startDate = values["start_date"];
        const endDate = values["end_date"];

        const startDateStr = startDate.startOf("day").toISOString();
        const endDateStr = endDate.endOf("day").toISOString();

        if (!editedCampaign) {
          const products: { product_id: number; single_lp_amount: string; lp_amount: string }[] = values["products"];
          const productWithIdZero = products.find(product => product.product_id === 0);
          let body;

          if (productWithIdZero) {
            const lpAmountForEachProduct = Number(productWithIdZero.lp_amount) / (productOptions.length - 1);
            console.log(
              "productWithIdZero.lp_amount: ",
              productWithIdZero.lp_amount,
              " Num products: ",
              productOptions.length - 1
            );
            body = {
              name: values["name"].trim(),
              merchant_store_id: values["store_id"],
              lp_amount: Number(values["lp_amount"]),
              start_date: startDateStr,
              end_date: endDateStr,
              status: isDraft ? 2 : 1,
              products: productOptions
                .filter(value => value.value !== 0)
                .map(product => ({
                  product_id: product.value,
                  single_lp_amount: Number(productWithIdZero.single_lp_amount),
                  status: 1,
                  lp_amount: lpAmountForEachProduct,
                })),
            };
          } else {
            body = {
              name: values["name"].trim(),
              merchant_store_id: values["store_id"],
              lp_amount: Number(values["lp_amount"]),
              start_date: startDateStr,
              end_date: endDateStr,
              products: products.map(product => ({
                product_id: product.product_id,
                single_lp_amount: Number(product.single_lp_amount),
                lp_amount: Number(product.lp_amount),
                status: 1,
              })),
              status: isDraft ? 2 : 1,
            };
          }
          try {
            setUploading(true);
            await defaultAxios.post(CREATE_MERCHANT_CAMPAIGN, body);
            toast.success("Create campaign success");
            refreshLP();
            onSuccess();
            onCancel();
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
            name: values["name"].trim(),
            start_date: startDateStr,
            end_date: endDateStr,
            status: isDraft ? 2 : 1,
            lp_amount: Number(values["lp_amount"]),
          };
          try {
            setUploading(true);
            await defaultAxios.put(UPDATE_MERCHANT_CAMPAIGN(editedCampaign.id), body);
            toast.success("Update campaign success");
            refreshLP();
            onSuccess();
            onCancel();
            setUploading(false);
          } catch (err) {
            const error = (err as AxiosError<any>)?.response?.data;
            setUploading(false);
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

  const { store } = useContext(AppContext);
  const { data: storeList } = store;
  // const storeOptions = [{value: '', label: 'All store'}]
  const storeOptions = useMemo(() => {
    const options = [];
    const stores = storeList.map(store => ({
      value: store.id,
      label: store.name,
    }));
    for (const store of stores) {
      options.push(store);
    }
    return options;
  }, [storeList]);

  const [storeId, setStoreId] = useState<number | undefined>(undefined);

  const onSelectStore = (value: number) => {
    clearProduct();
    setStoreId(value);
  };

  function checkAddable() {
    const products = form.getFieldValue("products");
    for (const pro of products) {
      if (pro && pro.product_id === 0) {
        setDisableAddProduct(true);
        return;
      }
    }

    setDisableAddProduct(false);
  }

  const onSelectProduct = (value: number) => {
    checkAddable();
  };

  const params = { page: 0, perPage: 1000, paginationMetadataStyle: "body" };

  const { data: products } = useFetchList<ProductItem>(storeId ? MERCHANTS_PRODUCTS_URL(storeId) : "", {
    ...params,
    sort_by: "create_time",
    order_by: "DESC",
  });

  const [disableAddProduct, setDisableAddProduct] = useState(false);
  const [uploading, setUploading] = useState(false);

  const productOptions = useMemo(() => {
    if (products) {
      const data = [{ value: 0, label: "All product", disabled: false }];
      const productsData = products.map(product => ({
        value: product.id,
        label: product.name + " - " + product.id,
        disabled: false,
      }));
      for (const pro of productsData) {
        data.push(pro);
      }
      return data;
    }
    return [];
  }, [products]);

  return (
    <CustomModal
      maskClosable={false}
      title={editedCampaign ? "Update campaign" : "Create new campaign"}
      open={openModal}
      onCancel={onCancel}
    >
      {uploading && (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      )}
      <Form
        form={form}
        name="create-campaign"
        wrapperCol={{ span: 24 }}
        initialValues={{}}
        // onFinish={onFinish}
        onError={e => console.log(e)}
        autoComplete="off"
      >
        <Row>
          <Col span={24}>
            <CustomInput
              label="Campaign name"
              name={"name"}
              placeholder="Enter Campaign name"
              rules={[
                { required: true, message: "This field is required", whitespace: true },
                { max: 160, message: "Quantity must be less than 160 characters" },
              ]}
              maxLength={161}
              onMouseMove={removeExtraSpace("name", form)}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <CustomSelect
              placeholder="Please select store"
              disabled={editedCampaign !== undefined}
              name="store_id"
              label="Store"
              rules={[{ required: true, message: "This field is required" }]}
              onChange={(value, option) => onSelectStore(value)}
              options={storeOptions}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <CustomInput
              isCustom={true}
              placeholder="LP amount"
              onChange={e => handleOnChangeAmount(e, "lp_amount")}
              onWheel={e => (e.target as HTMLElement).blur()}
              onKeyDown={integerOnlyInput}
              label={
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div>LP amount</div>
                  <div style={{ fontWeight: 500, fontSize: 14, lineHeight: "20px", color: "#FFFFFF" }}>
                    Current LP: <span style={{ color: "#12B76A" }}>{formatLP(lp?.total_point || 0)}</span>
                  </div>
                </div>
              }
              name={"lp_amount"}
              rules={[
                {
                  required: true,
                  message: "This field is required",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const max = lp ? lp.total_point : 0;
                    if (value && value <= 0) {
                      return Promise.reject(new Error("Amount must be greater than 0"));
                    }
                    if (editedCampaign) {
                      if (value && !Number(value)) {
                        return Promise.reject(new Error("Amount must be number"));
                      }
                      if (value && Number(value) - editedCampaign.lp_amount > max) {
                        return Promise.reject(new Error("Insufficient amount"));
                      }
                      return Promise.resolve();
                    }
                    if (value && Number(value) > max) {
                      return Promise.reject(new Error("Insufficient amount"));
                    }
                    if (value && !Number(value)) {
                      return Promise.reject(new Error("Amount must be number"));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            />
          </Col>
        </Row>

        {editedCampaign === undefined && (
          <Row>
            <Col span={24}>
              <Form.List name="products">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(field => (
                      <Row key={field.key} className={styles.productItemContent}>
                        <Row>
                          <Col span={20}>
                            <CustomSelect
                              placeholder="Please select products"
                              name={[field.name, "product_id"]}
                              label="Products"
                              rules={[
                                { required: true, message: "This field is required" },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (value === 0 && form.getFieldValue("products").length > 1) {
                                      return Promise.reject(new Error("Delete other product to use this options"));
                                    }
                                    if (value) {
                                      const products = form.getFieldValue("products");
                                      for (const pro of products) {
                                        if (pro.product_id === 0) {
                                          return Promise.reject(new Error("Can not select other product"));
                                        }
                                      }
                                    }
                                    return Promise.resolve();
                                  },
                                }),
                              ]}
                              options={productOptions}
                              onChange={value => onSelectProduct(value)}
                            />

                            <CustomInput
                              label={"LP amount"}
                              placeholder="Enter LP amount"
                              type="number"
                              name={[field.name, "lp_amount"]}
                              onWheel={e => (e.target as HTMLElement).blur()}
                              onKeyDown={integerOnlyInput}
                              onChange={e => handleOnChangeAmount(e, "lp_amount")}
                              rules={[
                                {
                                  required: true,
                                  message: "This field is required",
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    const max = getFieldValue("lp_amount");
                                    const allAmount: { lp_amount: string }[] = getFieldValue("products");
                                    const totalAmount: number = allAmount.reduce(
                                      (sum, item) => sum + Number(item.lp_amount),
                                      0
                                    );
                                    if (value && Number(value) <= 0) {
                                      return Promise.reject(new Error("Amount must be greater than 0"));
                                    }
                                    if (value && totalAmount > max) {
                                      return Promise.reject(new Error("Amount over budget"));
                                    }
                                    return Promise.resolve();
                                  },
                                }),
                              ]}
                            />

                            <CustomInput
                              label={"LP amount for each product"}
                              placeholder="LP amount for each product"
                              name={[field.name, "single_lp_amount"]}
                              onWheel={e => (e.target as HTMLElement).blur()}
                              onKeyDown={integerOnlyInput}
                              onChange={event => {
                                form.setFieldValue(
                                  ["products", field.name, "single_lp_amount"],
                                  event.target.value.replace(LETTER_REGEX, "")
                                );
                              }}
                              rules={[
                                {
                                  required: true,
                                  message: "This field is required",
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (value && value <= 0) {
                                      return Promise.reject(new Error("Amount must be greater than 0"));
                                    }

                                    if (value) {
                                      const allAmount: { lp_amount: string; single_lp_amount: string }[] =
                                        getFieldValue("products");
                                      for (const pro of allAmount) {
                                        if (
                                          pro.lp_amount &&
                                          pro.single_lp_amount &&
                                          Number(pro.lp_amount) < Number(pro.single_lp_amount)
                                        ) {
                                          return Promise.reject(
                                            new Error("LP amount for each product must be less than LP Amount")
                                          );
                                        }
                                      }
                                    }

                                    return Promise.resolve();
                                  },
                                }),
                              ]}
                            />
                          </Col>

                          <Col span={4} className={styles.deleteProduct}>
                            <TrashIcon
                              onClick={() => {
                                remove(field.name);
                                checkAddable();
                              }}
                              className={styles.deleteIcon}
                            />
                          </Col>
                        </Row>
                      </Row>
                    ))}

                    <Form.Item>
                      <Button
                        disabled={disableAddProduct}
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        style={{ marginTop: "20px" }}
                      >
                        Add products
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
        )}

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Start date"
              name={"start_date"}
              className={`${styles.group} ${styles.label}`}
              labelCol={{ span: 24 }}
              rules={[{ type: "object" as const, required: true, message: "Please select time!" }]}
            >
              <DatePicker
                format={"DD/MM/YYYY"}
                popupClassName="picker"
                disabledDate={current => {
                  return dayjs().add(-1, "days") >= current;
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="End date"
              name={"end_date"}
              className={`${styles.group} ${styles.label}`}
              labelCol={{ span: 24 }}
              rules={[{ type: "object" as const, required: true, message: "Please select time!" }]}
            >
              <DatePicker
                format={"DD/MM/YYYY"}
                disabledDate={current => {
                  return dayjs().add(-1, "days") >= current;
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <div className={styles.groupButton}>
          <Row style={{ width: "100%" }}>
            <Col span={8}>
              <Button style={{ width: "90%", marginBottom: 0 }} onClick={onCancel} className={styles.cancel}>
                <GradientText text="Cancel" />
              </Button>
            </Col>
            <Col span={8}>
              <Button
                style={{ width: "90%", marginLeft: "0%" }}
                type="default"
                onClick={() => onFinish(true)}
                className={styles.draft}
              >
                Draft
              </Button>
            </Col>
            <Col span={8}>
              <Button
                type={"primary"}
                style={{ width: "90%", marginLeft: "0%" }}
                onClick={() => onFinish(false)}
                className={styles.save}
              >
                Save & Publish
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </CustomModal>
  );
};

export default ModalCreateCampaign;
