import { useLoadScript } from "@react-google-maps/api";
import { Button, Col, Form, Input, message, Row } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckBoxList from "../../../commons/components/CheckBoxList/CheckBoxList";
import CustomInput from "../../../commons/components/CustomInput/CustomInput";
import FormBox from "../../../commons/components/FormBox/FormBox";
import FormHeader from "../../../commons/components/FormHeader/FormHeader";
import TextArea from "../../../commons/components/TextArea/TextArea";
import { API_KEY, PHONE_NUMBER_PATTERN } from "../../../commons/constants";
import {
  CATEGORIES_CHILDREN_URL,
  CATEGORIES_PARENT_URL,
  CREATE_STORE_ADDRESS_REQUEST_URL,
  CREATE_STORE_REQUEST_URL,
  UPDATE_STORE_ADDRESS_REQUEST_URL,
  UPDATE_STORE_REQUEST_URL,
} from "../../../commons/constants/api-urls";
import { navigations } from "../../../commons/constants/routers";
import { OPEN_24H_OPTIONS, SERVICE_SUPPORT_OPTIONS, STORE_STATUS } from "../../../commons/constants/store";
import defaultAxios from "../../../commons/utils/axios";
import {
  getAddressFromStoreValues,
  getBodyFromStoreValues,
  getValuesFromStoreDetail,
} from "../../../commons/utils/functions/storeMapping";
import { AppContext } from "../../../contexts/AppContext";
import PlacesAutoComplete from "../../Map/PlacesAutoComplete";
import styles from "./CreateUpdateStoreForm.module.scss";
import removeExtraSpace from "../../../commons/utils/functions/removeExtraSpace";
import {
  decimalOnlyInput,
  filterECharacterInputDecimal,
  filterECharacterInputNumber,
  integerOnlyInput,
} from "../../../commons/utils/functions/integerOnly";
import CustomImageInput from "../../../commons/components/CustomImageInput/CustomImageInput";
import { uploadImageToServer } from "../../../commons/utils/functions/uploadImageToServer";
import { numberInputOnWheelPreventChange } from "../../../commons/utils/functions/helper";
import RadioBoxList from "../../../commons/components/RadioBoxList/RadioBoxList";
import OpeningHours from "./OpeningHours";
import { CustomSelect } from "../../../commons/components/CustomSelect/CustomSelect";

type Props = {
  store?: Store | null;
  address?: StoreAddress;
};

const CreateUpdateStoreForm = ({ store, address }: Props) => {
  const { user, setCurrentStore, store: storeState } = useContext(AppContext);
  const { refresh } = storeState;
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateUpdateStoreValues>();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [cateOptionLevel2, setCateOptionLevel2] = useState<{ value: string; label: string }[]>([]);
  const [cateOptionLevel3, setCateOptionLevel3] = useState<{ value: string; label: string }[]>([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: CreateUpdateStoreValues) => {
    setLoading(true);
    try {
      const { logo, banners } = values;
      const bannerUrl = banners?.filter(banner => typeof banner === "string") as string[];
      const newBanners = banners?.filter(banner => typeof banner !== "string");
      const logoUrl = typeof logo[0] === "string" ? logo[0] : await uploadImageToServer(logo);

      if (newBanners) {
        await uploadImageToServer(newBanners).then(res => {
          if (Array.isArray(res)) {
            res.forEach(item => bannerUrl.push(item));
          } else {
            bannerUrl.push(res);
          }
        });
      }
      const body = {
        ...getBodyFromStoreValues(values),
        logo: logoUrl,
        banners: bannerUrl,
        merchantId: user?.merchantIds?.[0],
      };
      const addressBody = getAddressFromStoreValues(values);

      if (!user?.merchantIds?.[0]) return;

      const res = store?.id
        ? await defaultAxios.put<CreateUpdateStoreResponse>(UPDATE_STORE_REQUEST_URL.concat(`/${store.id}`), body)
        : await defaultAxios.post<CreateUpdateStoreResponse>(CREATE_STORE_REQUEST_URL, body);
      address?.id
        ? await defaultAxios.put(UPDATE_STORE_ADDRESS_REQUEST_URL, {
            ...addressBody,
            merchantStoreApprovalId: res.data.id,
          })
        : await defaultAxios.post(CREATE_STORE_ADDRESS_REQUEST_URL(res.data.id), addressBody);

      message.success(store?.id ? "Save change successfuly" : "Create store successfuly");
      setCurrentStore(null);
      refresh();
      navigate(navigations.STORES.LIST);
    } catch (error: any) {
      console.log(error);
      message.error(store?.id ? "Save change failed" : "Create store failed");
    }
    setLoading(false);
  };

  async function handleGetCategory() {
    try {
      const res = await defaultAxios.get(CATEGORIES_PARENT_URL);
      setOptions(res?.data?.map((category: Category) => ({ value: category.id, label: category.name })) || []);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGetChildCategory(parentId: string) {
    try {
      const res = await defaultAxios.get(CATEGORIES_CHILDREN_URL, { params: { categoryIds: parentId } });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGetListSubCategoryLevel2(value: string[]) {
    if (value.length === 0) {
      setCateOptionLevel2([]);
      setCateOptionLevel3([]);
      return;
    }
    try {
      const cateLevel2 = await handleGetChildCategory(value.join(","));
      const listCate = cateLevel2.map((cate: any) => {
        return cate.children?.map((category: Category) => ({ value: category.id, label: category.name }));
      });
      setCateOptionLevel2(listCate.flat());
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGetListSubCategoryLevel3(value: string[]) {
    if (value.length === 0) return setCateOptionLevel3([]);
    try {
      const cateLevel3 = await handleGetChildCategory(value.join(","));
      const listCate = cateLevel3.map((cate: any) => {
        return cate.children?.map((category: Category) => ({ value: category.id, label: category.name }));
      });

      setCateOptionLevel3(listCate.flat());
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancel = () => {
    if (store?.id) {
      form.resetFields();
      navigate(navigations.STORES.LIST);
    } else navigate(-1);
  };

  const isOpen24Hours = Form.useWatch(["isOpen24Hours"], form);

  const isUpdatingStore = useMemo(() => {
    return store?.id ? true : false;
  }, [store]);

  const isHavingRequestUpdate = useMemo(() => {
    return store?.merchantStoreApproval && store?.merchantStoreApproval.length > 0 ? true : false;
  }, [store]);

  useEffect(() => {
    form.setFieldsValue(getValuesFromStoreDetail(store, address));
    handleGetListSubCategoryLevel2(form.getFieldValue("categoryLevel1Ids"));
    handleGetListSubCategoryLevel3(form.getFieldValue("categoryLevel2Ids"));
  }, [store, address, form]);

  useEffect(() => {
    handleGetCategory();
  }, []);

  const StoreId = () => {
    if (store?.id) {
      return (
        <div className={styles.storeStatusBox}>
          <div className={styles.storeIdBox}>
            <p>
              Store ID: <span>#{store.id}</span>
            </p>
            <p>
              POS ID: <span>#{store.triFoodPOSes.map(item => item.POSId).join(", ")}</span>
            </p>
          </div>
          <div className={styles.storeStatus}>
            <p>
              Status: <span>{STORE_STATUS[store.status]}</span>
            </p>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const StoreAction = () => {
    return (
      <>
        <Button type="text" className={styles.cancel} onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Form.Item noStyle shouldUpdate={() => true}>
          {() => {
            return (
              <Button
                type="primary"
                htmlType="submit"
                className={styles.save}
                disabled={loading || !!form.getFieldsError().find(item => item.errors.length)}
              >
                {loading ? "Saving" : "Save"}
              </Button>
            );
          }}
        </Form.Item>
      </>
    );
  };

  const StoreHasPendingUpdateRequest = () => {
    return <div className={styles.warning}>This store still has a pending update request</div>;
  };
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Form
      form={form}
      name="create-store"
      wrapperCol={{ span: 24 }}
      initialValues={getValuesFromStoreDetail(store, address)}
      onFinish={onFinish}
      onError={e => console.log(e)}
      autoComplete="off"
      scrollToFirstError={true}
    >
      <FormHeader
        title={store?.name ?? "Create new store"}
        actions={
          <>
            {isHavingRequestUpdate ? (
              <>
                <StoreHasPendingUpdateRequest />
              </>
            ) : (
              <>{<StoreAction />}</>
            )}
          </>
        }
      />
      <FormBox title="Basic information">
        <StoreId />

        <CustomInput
          name="name"
          label="Store name"
          onBlur={removeExtraSpace("name", form)}
          placeholder="Enter your Store name"
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
          name="logo"
          label="Store logo"
          square
          isSingle={true}
          multiple={1}
          onError={err => form?.setFields([{ name: "logo", errors: [err] }])}
          rules={[{ required: true, message: "This field is required" }]}
          isEdit={store?.id ? true : false}
          form={form}
        />
        <CustomImageInput
          name="banners"
          label="Store banners"
          multiple={3}
          onError={err => form?.setFields([{ name: "banners", errors: [err] }])}
          description="Up to 3 banners"
          rules={[{ required: true, message: "This field is required" }]}
          isEdit={store?.id ? true : false}
          form={form}
        />
        <CheckBoxList
          name="service_supports"
          label="Service support"
          options={SERVICE_SUPPORT_OPTIONS}
          rules={[{ required: true, message: "This field is required" }]}
          groupClassName={styles.serviceSupports}
        />

        <p className={styles.title}>Category Level 1</p>
        <CustomSelect
          rules={[{ required: true, message: "This field is required" }]}
          placeholder="Choose business categories"
          name="categoryLevel1Ids"
          options={options}
          defaultValue={options?.[0]?.value}
          mode="multiple"
          allowClear
          className={styles.bussinessCategory}
          onChange={handleGetListSubCategoryLevel2}
        />

        {cateOptionLevel2?.length > 0 && (
          <>
            <p className={styles.title}>Category Level 2</p>
            <CustomSelect
              rules={[{ required: false, message: "This field is required" }]}
              placeholder="Choose business sub categories level 2"
              name="categoryLevel2Ids"
              options={cateOptionLevel2}
              mode="multiple"
              allowClear
              className={styles.bussinessCategory}
              onChange={handleGetListSubCategoryLevel3}
            />
          </>
        )}

        {cateOptionLevel3?.length > 0 && (
          <>
            <p className={styles.title}>Category Level 3</p>
            <CustomSelect
              rules={[{ required: false, message: "This field is required" }]}
              placeholder="Choose business sub categories level 3"
              name="categoryLevel3Ids"
              options={cateOptionLevel3}
              mode="multiple"
              allowClear
              className={styles.bussinessCategory}
            />
          </>
        )}

        <CustomInput
          name="min_order"
          label="Minimum order"
          onBlur={removeExtraSpace("min_order", form)}
          onWheel={numberInputOnWheelPreventChange}
          placeholder="Enter minimum order"
          type="number"
          onKeyDown={decimalOnlyInput}
          onChange={event => filterECharacterInputDecimal("min_order", form, event)}
          prefix={<div className={styles.preFix}>$</div>}
          rules={[
            {
              validator: (_, value) => {
                //validate input only have 2 decimal
                if (value && value.toString().split(".")[1]?.length > 2) {
                  return Promise.reject(new Error("Only 2 decimal"));
                }
                //validate input must be greater than 0
                if (value && value < 0) {
                  return Promise.reject(new Error("Minimum order must be greater than 0"));
                }
                if (value && value.toString().startsWith(".")) {
                  return Promise.reject(new Error("Invalid number"));
                }
                return Promise.resolve();
              },
            },
            {
              required: true,
              message: "This field is required",
            },
          ]}
        />

        <CustomInput
          name="hours_until_auto_complete"
          label="Auto complete order timeout"
          onBlur={removeExtraSpace("hours_until_auto_complete", form)}
          onWheel={numberInputOnWheelPreventChange}
          placeholder="Enter auto complete order timeout"
          prefix={<div className={styles.preFix}>Hours |</div>}
          type="number"
          onKeyDown={integerOnlyInput}
          onChange={event => filterECharacterInputNumber("hours_until_auto_complete", form, event)}
          rules={[
            {
              required: true,
              message: "This field is required",
            },

            {
              validator: (_, value) => {
                //  validate between 0-24
                if (value && value < 0) {
                  return Promise.reject(new Error("Hours must be between 0 and 24"));
                }
                if (value && value > 24) {
                  return Promise.reject(new Error("Hours must be between 0 and 24"));
                }
                return Promise.resolve();
              },
            },
          ]}
        />

        <TextArea
          name="description"
          label="Description"
          onBlur={removeExtraSpace("description", form)}
          placeholder="Tell us something about your store"
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

        <Row gutter={24}>
          <Col xs={24} sm={24}>
            <CustomInput
              name="outletContactPerson"
              label="Outlet contact person"
              onBlur={removeExtraSpace("outletContactPerson", form)}
              placeholder="Enter your outlet contact person"
              rules={[
                {
                  required: false,
                  message: "This field is required",
                  whitespace: true,
                },
              ]}
              maxLength={120}
            />
          </Col>
        </Row>
        <RadioBoxList
          name={"halalCertified"}
          label={"Halal Certification"}
          options={OPEN_24H_OPTIONS}
          rules={[{ required: true, message: "This field is required" }]}
          groupClassName={styles.serviceSupports}
        />
        <RadioBoxList
          name={"muslimOwned"}
          label={"Muslim Owned"}
          options={OPEN_24H_OPTIONS}
          rules={[{ required: true, message: "This field is required" }]}
          groupClassName={styles.serviceSupports}
        />
        <RadioBoxList
          name="isOpen24Hours"
          label="Open 24 hours"
          options={OPEN_24H_OPTIONS}
          rules={[{ required: true, message: "This field is required" }]}
          groupClassName={styles.serviceSupports}
        />
        {!isOpen24Hours && (
          <>
            <OpeningHours form={form} Form={Form} isUpdatingStore={isUpdatingStore} />
          </>
        )}
      </FormBox>
      <FormBox title="Store address">
        <CustomInput
          prefix="+65 |"
          name="phone"
          label="Phone number"
          onChange={event => filterECharacterInputNumber("phone", form, event)}
          rules={[
            { required: true, message: "This field is required" },
            { pattern: PHONE_NUMBER_PATTERN, message: "Phone number invalid" },
          ]}
          placeholder="Input your phone number"
          onBlur={removeExtraSpace("phone", form)}
        />
        <Form.Item name="coordinate" noStyle>
          <Input hidden />
        </Form.Item>
        <Form.Item noStyle dependencies={["coordinate"]}>
          {({ getFieldValue, setFieldValue, setFieldsValue, validateFields }) => (
            <PlacesAutoComplete
              selected={getFieldValue("coordinate")}
              setSelected={value => {
                setFieldsValue({ coordinate: value });
                setFieldValue("coordinate", value);
              }}
              defaultAddress={getFieldValue("address")}
              validateAddress={() => validateFields(["address"])}
              setLocation={data => {
                setFieldValue("address", data?.description || "");
              }}
            />
          )}
        </Form.Item>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <CustomInput
              name="location_type"
              label="Landmark"
              rules={[{ required: true, message: "This field is required" }]}
              placeholder="Landmark"
              maxLength={100}
              onBlur={removeExtraSpace("location_type", form)}
            />
          </Col>
          <Col xs={24} sm={12}>
            <CustomInput
              name="postal_code"
              label="Postal code"
              rules={[{ required: true, message: "This field is required" }]}
              placeholder="Postal code"
              maxLength={6}
              onChange={event => filterECharacterInputNumber("postal_code", form, event)}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <CustomInput
              name="city_or_province"
              label="City"
              rules={[{ required: true, message: "This field is required" }]}
              placeholder="City"
              onBlur={removeExtraSpace("city_or_province", form)}
              maxLength={20}
            />
          </Col>
          <Col xs={24} sm={12}>
            <CustomInput
              name="country"
              label="Country"
              rules={[{ required: true, message: "This field is required" }]}
              placeholder="Country"
              maxLength={20}
              onBlur={removeExtraSpace("country", form)}
            />
          </Col>
        </Row>
      </FormBox>
    </Form>
  );
};

export default CreateUpdateStoreForm;
