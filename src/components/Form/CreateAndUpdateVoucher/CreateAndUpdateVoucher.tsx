import { Button, Col, DatePicker, Form, message, Radio, Row } from "antd";
import dayjs from "dayjs";
import _, { flattenDeep } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductStatusEnum } from "../../../../src/commons/constants/product";
import ConfirmPopup from "../../../commons/components/ConfirmPopup/ConfirmPopup";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import { CustomSelect } from "../../../commons/components/CustomSelect/CustomSelect";
import FormBox from "../../../commons/components/FormBox/FormBox";
import FormHeader from "../../../commons/components/FormHeader/FormHeader";
import TextArea from "../../../commons/components/TextArea/TextArea";
import { MERCHANTS_PRODUCTS_URL, PRODUCTS_VOUCHER, VOUCHER, VOUCHER_DETAIL } from "../../../commons/constants/api-urls";
import { navigations } from "../../../commons/constants/routers";
import defaultAxios from "../../../commons/utils/axios";
import { STATUS_CODE } from "../../Notification/Notification";
import styles from "./CreateAndUpdateVoucher.module.scss";
import { filterECharacterInputNumber } from "../../../commons/utils/functions/integerOnly";
import { ALL } from "../../../commons/constants";

type Props = {
  store?: Store | null;
  address?: StoreAddress;
};

const RADIO_VALUE = {
  FIXED_AMOUNT: 0,
  FREE_ITEM: 1,
};

export enum VoucherStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  DRAFT = 2,
}

export enum VoucherProductStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}

const CreateAndUpdateVoucherForm = ({ store }: Props) => {
  const navigate = useNavigate();
  const params = { page: 0, perPage: 1000, paginationMetadataStyle: "body", status: ProductStatusEnum.ACTIVE };
  const [form] = Form.useForm<CreateUpdateStoreValues>();

  const [loading, setLoading] = useState(false);
  const { storeId, voucherId } = useParams<{ storeId: string; voucherId: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [productIds, setProductIds] = useState<any[]>([]);
  const [currentRadio, setCurrentRadio] = useState(String(RADIO_VALUE.FIXED_AMOUNT));
  const [listProductDetail, setListProductDetail] = useState<any[]>([]);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [detail, setDetail] = useState<any>();
  const [productApplied, setProductApplied] = useState([]);
  const [productVariantsOption, setProductVariantsOption] = useState<any[]>([]);

  const isDisable = useMemo(() => {
    return !!(detail?.status === VoucherStatus.ACTIVE || detail?.status === VoucherStatus.INACTIVE);
  }, [detail?.status]);

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Number(voucherId) > 0) {
      getVoucherDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucherId]);

  useEffect(() => {
    if (Number(voucherId) > 0) {
      getProductOfVoucher();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucherId]);

  const getVoucherDetail = async () => {
    try {
      const res = await defaultAxios.get(VOUCHER_DETAIL(voucherId as string));
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setDetail(res.data);
      }
    } catch (error) {}
  };

  const getProducts = async () => {
    try {
      const res = await defaultAxios.get(MERCHANTS_PRODUCTS_URL(storeId as string), { params });
      if (res.data.data && res.status === STATUS_CODE.SUCCESS) {
        setProducts(res.data.data);
      }
    } catch (error) {}
  };

  const getProductOfVoucher = async () => {
    try {
      const res = await defaultAxios.get(PRODUCTS_VOUCHER(voucherId as string));
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setProductApplied(res.data);
      }
    } catch (error) {}
  };

  const setUpFormValues = () => {
    setLoading(true);
    const isDiscount = Number(detail.discount_amount) > 0;
    const hasProducts = productApplied.length > 0;
    let start_date = dayjs(detail.start_date);
    let end_date = dayjs(detail.end_date);
    detail.start_date = start_date;
    detail.end_date = end_date;
    setTimeout(() => {
      form.setFieldsValue(
        _.pick(detail, [
          "name",
          "description",
          "supply",
          "start_date",
          "end_date",
          "discount_amount",
          "minimum_spending",
        ])
      );
      if (isDiscount) {
        setCurrentRadio(String(RADIO_VALUE.FIXED_AMOUNT));
      } else {
        setCurrentRadio(String(RADIO_VALUE.FREE_ITEM));
      }
      if (hasProducts) {
        const productIds = productApplied.map((item: any) => item.product_id);
        setProductIds(productIds);
      } else {
        setProductIds([ALL]);
      }
      if (detail && Number(detail?.free_product_item_id) > 0) {
        const freeProduct = getProductFree(detail?.free_product_item_id);
        if (freeProduct && freeProduct.id) {
          console.log(`${freeProduct.id} : set product_id`);
          form.setFieldValue("product_id", `${freeProduct.id}`);
          const variant = getVariantOption(freeProduct.id).find(v => v.value === detail.free_product_item_id);
          form.setFieldValue("free_product_item_id", variant);
        }
      }
      setLoading(false);
    }, 1000);
  };

  const productOptions = useMemo(() => {
    if (products.length > 0) {
      const data = [{ value: ALL, label: "All product" }];
      const productsData = products?.map(product => ({
        value: String(product.id),
        label: product.name + " - " + product.id,
      })) as any;
      for (const pro of productsData) {
        data.push(pro);
      }
      return data;
    }
    return [];
  }, [products]);

  const getVariantOption = (selectProductFree: number) => {
    let final: { value: any; label: string }[] = [];
    const product = listProductDetail.find(item => item?.id === selectProductFree);
    const attributes = (product?.attributes || []) as any[];
    attributes.forEach((attribute: any) => {
      const variants = (attribute?.variants || []) as any[];
      variants.forEach((item: any) => {
        final.push({
          value: item?.id,
          label: `${item?.attribute_name} ${item?.attribute_value}`,
        });
      });
    });
    return final;
  };

  useEffect(() => {
    if (Number(voucherId) > 0 && detail) {
      setUpFormValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucherId, detail, productApplied, listProductDetail]);

  const getProductFree = (free_product_item_id: number) => {
    const product = listProductDetail.find(item => {
      const attributes = item?.attributes || [];
      const variantIds: any[] = attributes?.map((attr: any) => {
        return attr?.variants?.map((v: any) => v.id);
      });
      const listIds = flattenDeep(variantIds);
      return listIds.includes(free_product_item_id);
    });
    return product;
  };

  const isSelectFixedAmount = useMemo(() => {
    return currentRadio === String(RADIO_VALUE.FIXED_AMOUNT);
  }, [currentRadio]);

  const isSelectFreeItem = useMemo(() => {
    return currentRadio === String(RADIO_VALUE.FREE_ITEM);
  }, [currentRadio]);

  useEffect(() => {
    if (store?.id) {
      form.setFieldValue("merchant_store_id", store.id);
    }
  }, [store?.id, form]);

  useEffect(() => {
    if (Number(detail?.id) > 0) {
      const freeProduct = getProductFree(detail?.free_product_item_id);
      const variants = getVariantOption(freeProduct?.id);
      setProductVariantsOption(variants);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, listProductDetail]);

  useEffect(() => {
    if (productIds.length > 0) {
      form.setFieldValue(
        "products",
        productIds.map(item => String(item))
      );
    } else {
      form.setFieldValue("products", [ALL]);
    }
  }, [form, productIds]);

  useEffect(() => {
    if (products.length > 0) {
      getListProductDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const getListProductDetail = async () => {
    const productIds = products.map(item => item.id);
    const promises = productIds.map(productId => defaultAxios.get(`merchant-management/products/${productId}`));
    try {
      const res = await Promise.all(promises);
      const listProductDetail = res.map(item => item.data);
      setListProductDetail(listProductDetail);
    } catch (error) {}
  };

  // reset when choose item
  useEffect(() => {
    if (currentRadio === String(RADIO_VALUE.FIXED_AMOUNT)) {
      form.resetFields(["product_id", "free_product_item_id"]);
    } else {
      form.resetFields(["discount_amount"]);
    }
  }, [currentRadio, form]);

  const onFinish = async (isDraft?: boolean) => {
    form
      .validateFields()
      .then(async (values: any) => {
        setLoading(true);
        try {
          const startDate = values["start_date"];
          const endDate = values["end_date"];
          const supply = Number(values["supply"]);
          const minimum_spending = Number(values["minimum_spending"]);
          const productsFromForm = values["products"] as any[];

          let newProducts;
          if (productsFromForm.filter(item => item === ALL).length > 0) {
            newProducts = products?.map(item => {
              return {
                product_id: item.id,
                status: VoucherProductStatus.ACTIVE,
              };
            });
          } else {
            newProducts = productsFromForm.map(item => {
              return {
                product_id: Number(item),
                status: VoucherProductStatus.ACTIVE,
              };
            });
          }

          const startDateStr = startDate.startOf("day").toISOString();
          const endDateStr = endDate.endOf("day").toISOString();
          let body = {
            ...values,
            is_allow_stacking: false,
            start_date: startDateStr,
            end_date: endDateStr,
            supply,
            minimum_spending: minimum_spending,
            status: isDraft ? VoucherStatus.DRAFT : VoucherStatus.ACTIVE,
            products: newProducts,
          };

          if (isSelectFixedAmount && values["discount_amount"]) {
            body = {
              ...body,
              discount_amount: Number(values["discount_amount"]),
              free_product_item_id: null,
            };
          }

          console.log("free product item", values["free_product_item_id"]);
          if (isSelectFreeItem && values["free_product_item_id"]) {
            body = {
              ...body,
              free_product_item_id:
                Number(values["free_product_item_id"]) || Number(values["free_product_item_id"]?.value),
              discount_amount: null,
            };
          }
          console.log({ body });
          let res;
          if (Number(voucherId) > 0) {
            res = await defaultAxios.put(VOUCHER_DETAIL(voucherId as string), body);
          } else {
            res = await defaultAxios.post<any>(VOUCHER, { ...body });
          }
          if (!res.data) throw res;
          let messageContent = Number(voucherId) > 0 ? "Update voucher successfuly" : `Create voucher successfuly`;
          message.success(messageContent);
          navigate(navigations.STORES.VOUCHER_LIST(storeId as string));
        } catch (error: any) {
          console.error(error);
          let messageFailCreate = error?.response?.data?.error?.message || `Create voucher failed`;
          let messageFailUpdate = error?.response?.data?.error?.message || `Update voucher failed`;

          message.error(Number(voucherId) > 0 ? messageFailUpdate : messageFailCreate);
        } finally {
          setLoading(false);
        }
      })
      .catch(errorInfo => {
        console.error({ errorInfo });
        setLoading(false);
      });
  };

  const handleCancel = () => {
    navigate(navigations.STORES.VOUCHER_LIST(storeId as string));
  };

  const handleChangeProduct = (value: string) => {
    const arrValue = _.split(value, ",");
    if (arrValue.slice(-1)[0] == ALL) {
      setProductIds([ALL]);
    } else if (arrValue[0] == ALL && arrValue.length > 1) {
      const newArrValue = arrValue.filter((item: string) => item !== ALL);
      setProductIds(newArrValue.map(item => Number(item)));
    }
  };
  const Note = () => {
    return (
      <>
        Note : <span>The input data can't be changed after users click Save*</span>
      </>
    );
  };
  return (
    <Form
      form={form}
      name="create-voucher"
      wrapperCol={{ span: 24 }}
      onError={e => console.log(e)}
      autoComplete="off"
      scrollToFirstError={true}
      disabled={isDisable}
      onFieldsChange={event => {
        const fieldName = event[0].name as any;
        const value = event[0]?.value;
        if (fieldName[0] === "product_id") {
          const options = getVariantOption(Number(value)) as any;
          setProductVariantsOption(options);
          form.resetFields(["free_product_item_id"]);
        }
      }}
    >
      <FormHeader
        note={<Note />}
        title={Number(voucherId) > 0 ? `${isDisable ? "" : "Edit"} ${detail?.name}` : "Create New Voucher"}
        actions={
          <>
            <Button type="text" className={styles.cancel} onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Form.Item noStyle shouldUpdate={() => true}>
              {() => {
                return (
                  <>
                    <Button
                      type="default"
                      itemType=""
                      className={styles.draft}
                      onClick={() => onFinish(true)}
                      disabled={loading || isDisable}
                    >
                      Save as draft
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        form.validateFields().then(async (values: any) => {
                          setOpenConfirmPopup(true);
                        });
                      }}
                      className={styles.save}
                      disabled={loading || isDisable}
                    >
                      {loading ? "Saving" : "Save"}
                    </Button>
                  </>
                );
              }}
            </Form.Item>
          </>
        }
      />
      <FormBox title="Basic information">
        <CustomInput
          name="name"
          label="Voucher name"
          placeholder="Enter voucher name"
          rules={[
            {
              required: true,
              message: "This field is required",
              whitespace: true,
            },
          ]}
        />
        <TextArea
          name="description"
          label="Description"
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
        <CustomInput
          name="supply"
          label="Supply"
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
                if (value && !Number.isInteger(Number(value))) {
                  return Promise.reject(new Error("Amount must be integer"));
                }
                return Promise.resolve();
              },
            }),
          ]}
          placeholder="Enter voucher supply"
          onChange={event => filterECharacterInputNumber("supply", form, event)}
        />
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Start date"
              name={"start_date"}
              rules={[
                { type: "object" as const, required: true, message: "This field is required" },
                {
                  validator: (_, value) => {
                    if (
                      value &&
                      form.getFieldValue("end_date") &&
                      dayjs(value).isAfter(form.getFieldValue("end_date"))
                    ) {
                      return Promise.reject("Start date must before than end date");
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
              className={`${styles.group} ${styles.label}`}
              labelCol={{ span: 24 }}
            >
              <DatePicker
                format={"DD/MM/YYYY"}
                popupClassName="picker"
                style={{ background: "transparent" }}
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
              rules={[{ type: "object" as const, required: true, message: "This field is required" }]}
              className={`${styles.group} ${styles.label}`}
              labelCol={{ span: 24 }}
            >
              <DatePicker
                format={"DD/MM/YYYY"}
                style={{ background: "transparent" }}
                onChange={() => {
                  form.validateFields(["start_date"]);
                }}
                disabledDate={current => {
                  return form.getFieldValue("start_date") >= current;
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </FormBox>
      <FormBox title="Applicable Products">
        <Col xs={24} sm={24}>
          <CustomSelect
            placeholder="Please select store"
            name="merchant_store_id"
            label="Store"
            defaultValue={store?.id}
            defaultActiveFirstOption
            rules={[{ required: true, message: "This field is required" }]}
            options={[
              {
                value: store?.id,
                label: store?.name,
              },
            ]}
          />
        </Col>

        <Row gutter={24}>
          <Col xs={24} sm={24}>
            <CustomSelect
              placeholder="Please select product"
              mode="multiple"
              name="products"
              label="Products"
              rules={[{ required: true, message: "This field is required" }]}
              options={productOptions}
              onChange={handleChangeProduct}
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              value={productIds.length > 0 ? productIds.map(item => String(item)) : [ALL]}
            />
          </Col>
        </Row>
      </FormBox>

      <FormBox title="Discount">
        <Radio
          onClick={() => setCurrentRadio(String(RADIO_VALUE.FIXED_AMOUNT))}
          className={styles.customRadio}
          value={String(RADIO_VALUE.FIXED_AMOUNT)}
          checked={isSelectFixedAmount}
        >
          Fixed amount
        </Radio>
        <CustomInput
          name="discount_amount"
          label="Amount Deduct"
          rules={
            isSelectFixedAmount
              ? [
                  { required: true, message: "This field is required" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value && value <= 0) {
                        return Promise.reject(new Error("Amount must be greater than 0"));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]
              : []
          }
          placeholder="S$ Enter reward amount"
          disabled={currentRadio !== String(RADIO_VALUE.FIXED_AMOUNT) || detail}
          onChange={event => filterECharacterInputNumber("discount_amount", form, event)}
        />
        <Radio
          onClick={() => setCurrentRadio(String(RADIO_VALUE.FREE_ITEM))}
          className={styles.customRadio}
          value={String(RADIO_VALUE.FREE_ITEM)}
          checked={isSelectFreeItem}
        >
          Free Product Item
        </Radio>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <CustomSelect
              placeholder="Please select product"
              name="product_id"
              label="Choose product item"
              options={productOptions.filter(item => item.value !== ALL)}
              disabled={currentRadio !== String(RADIO_VALUE.FREE_ITEM)}
              rules={isSelectFreeItem ? [{ required: true, message: "This field is required" }] : []}
            />
          </Col>
          <Col xs={24} sm={12}>
            <CustomSelect
              options={productVariantsOption}
              name="free_product_item_id"
              label="Product’s Variants"
              placeholder="Please select..."
              disabled={currentRadio !== String(RADIO_VALUE.FREE_ITEM)}
              rules={isSelectFreeItem ? [{ required: true, message: "This field is required" }] : []}
            />
          </Col>
        </Row>
      </FormBox>
      <FormBox title="Conditions">
        <CustomInput
          name="type"
          label="Type"
          placeholder="Minimum Spending"
          value={"Minimum Spending"}
          disabled={true}
        />
        <Col xs={24} sm={12}>
          <CustomInput
            name="minimum_spending"
            label="Minimum Spending"
            placeholder="S$ Enter Spending amount"
            rules={[
              { required: true, message: "This field is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && value < 1) {
                    return Promise.reject(new Error("Amount must be greater than or equal 1"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            onChange={event => filterECharacterInputNumber("minimum_spending", form, event)}
          />
        </Col>
      </FormBox>
      <ConfirmPopup
        open={openConfirmPopup}
        onCancel={() => setOpenConfirmPopup(false)}
        title="Confirmation"
        description={`Once published, merchants can no longer edit voucher content, are you sure you want to publish this voucher`}
        onConfirm={() => {
          onFinish(false);
        }}
      />
    </Form>
  );
};

export default CreateAndUpdateVoucherForm;
