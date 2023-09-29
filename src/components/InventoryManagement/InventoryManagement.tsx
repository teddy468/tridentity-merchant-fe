import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, PaginationProps, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import BigNumber from "bignumber.js";
import _, { debounce, trim } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import CustomModal from "../../commons/components/CustomModal/CustomModal";
import CustomPagination from "../../commons/components/CustomPagination";
import CustomTable from "../../commons/components/CustomTable";
import CustomTabs from "../../commons/components/CustomTabs";
import GradientText from "../../commons/components/GradientText/GradientText";
import { INVENTORY_LIST, UPDATE_INVENTORY_STOCK } from "../../commons/constants/api-urls";
import { InventoryStatusEnum, ProductStatusEnum } from "../../commons/constants/product";
import { navigations } from "../../commons/constants/routers";
import { Inventory } from "../../commons/resources";
import defaultAxios from "../../commons/utils/axios";
import styles from "./InventoryManagement.module.scss";
import { filterECharacterInputNumber, integerOnlyInput } from "../../commons/utils/functions/integerOnly";

interface DataType {
  key: React.ReactNode;
  id: string;
  name: string;
  attributes: string;
  quantity: string | number;
  total_sold: string | number;
  status: string;
  isParent: boolean;
  children?: DataType[];
}

const STATE_STOCK = {
  IN_STOCK: "IN_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  RUN_OUT_SOON: "RUN_OUT_SOON",
};

const InventoryManagement: React.FC = () => {
  const navigate = useNavigate();

  const [metadata, setMetadata] = useState({
    "x-total-count": 0,
  });
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(ProductStatusEnum.ACTIVE.toString());
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const { storeId } = useParams<{ storeId: string }>();
  const [total, setTotal] = useState({
    total1: 0,
    total2: 0,
    total3: 0,
  });
  const [params, setParams] = useState({
    paginationMetadataStyle: "body",
    perPage: 10,
    page: 1,
    state: STATE_STOCK.IN_STOCK,
    search_value: "",
  });
  const [form] = Form.useForm<{ merchant_store_ids: string[]; updated_quantity: number | string }>();
  const [loading, setLoading] = useState(false);
  const [currentSelect, setCurrentSelect] = useState({
    productId: 0,
    key: 0,
    quantity: 0,
  });

  useEffect(() => {
    if (storeId) {
      getListInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, params]);

  useEffect(() => {
    if (storeId) {
      getCountAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, params]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const getCountAll = async () => {
    try {
      let param1 =
        activeTab === InventoryStatusEnum.IN_STOCK.toString() ? params : { ...params, state: STATE_STOCK.IN_STOCK };
      let param2 =
        activeTab === InventoryStatusEnum.RUN_OUT_SOON.toString()
          ? params
          : { ...params, state: STATE_STOCK.RUN_OUT_SOON };
      let param3 =
        activeTab === InventoryStatusEnum.OUT_OF_STOCK.toString()
          ? params
          : { ...params, state: STATE_STOCK.OUT_OF_STOCK };
      const promise1 = defaultAxios.get<any>(INVENTORY_LIST(storeId as string), { params: param1 });
      const promise2 = defaultAxios.get<any>(INVENTORY_LIST(storeId as string), { params: param2 });
      const promise3 = defaultAxios.get<any>(INVENTORY_LIST(storeId as string), { params: param3 });

      const [res1, res2, res3] = await Promise.all([promise1, promise2, promise3]);
      const total1 = res1.data.metadata["x-total-count"];
      const total2 = res2.data.metadata["x-total-count"];
      const total3 = res3.data.metadata["x-total-count"];
      setTotal({
        total1,
        total2,
        total3,
      });
    } catch (error) {}
  };

  const openProductDetailLog = (prodId: number | string) => {
    navigate(navigations.STORES.INVENTORY_LOG(storeId as string, prodId));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Product ID",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: any) => (
        <span onClick={() => openProductDetailLog(record?.id)} style={{ marginLeft: 12 }} className={styles.pointer}>
          {text}
        </span>
      ),
    },
    {
      title: "Product name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <span onClick={() => openProductDetailLog(record?.id)} className={styles.pointer}>
          {text}
        </span>
      ),
    },
    {
      title: "Attribute & variations",
      dataIndex: "attributes",
      key: "address",
      render: (text: string, record: any) => (
        <span onClick={() => openProductDetailLog(record?.id)} className={styles.pointer}>
          {text}
        </span>
      ),
    },
    {
      title: "Current Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text: string, record: any) => (
        <span onClick={() => openProductDetailLog(record?.id)} className={styles.pointer}>
          {text}
        </span>
      ),
    },
    {
      title: "Total Sold",
      dataIndex: "total_sold",
      key: "total_sold",
      render: (text: string, record: any) => (
        <span onClick={() => openProductDetailLog(record?.id)} className={styles.pointer}>
          {text}
        </span>
      ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (text: number, record: any) => (
    //     <span
    //       onClick={() => openProductDetailLog(record?.id)}
    //       className={styles.pointer}
    //       style={text === StatusItem.ACTIVE ? { color: "#12B76A" } : { color: "#F79009" }}
    //     >
    //       {text === StatusItem.ACTIVE ? "Active" : "Inactive"}
    //     </span>
    //   ),
    // },
    {
      title: "Action",
      key: "action",
      render: (text, record: any) => {
        const status = record.status;
        return (
          <div className={styles.actions} style={status > 0 ? { cursor: "pointer" } : { cursor: "no-drop" }}>
            <div className={styles.edit}>
              <Inventory
                onClick={() => {
                  if (status > 0) {
                    setOpenModal(true);
                    setCurrentSelect(record);
                  }
                }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const getResult = (data: any[]) => {
    const res = data.map((d, index) => {
      let items = d.items as any[];
      return {
        key: items[0].id,
        id: d.id,
        name: d.name,
        attributes: `${items[0].attribute_name} : ${items[0].attribute_value}`,
        quantity: items[0].current_quantity,
        total_sold: items[0].item_sales,
        isParent: true,
        status: d.status,
        productId: d.id,
        children:
          items.length > 1
            ? _.drop(items).map((item: any) => {
                return {
                  key: item.id,
                  id: "",
                  name: "",
                  attributes: `${item.attribute_name} : ${item.attribute_value}`,
                  total_sold: item.item_sales,
                  isParent: false,
                  status: d.status,
                  quantity: item.current_quantity,
                  productId: d.id,
                };
              })
            : [],
      };
    });
    setData(res);
  };

  const getListInventory = async () => {
    const res = await defaultAxios.get<any>(INVENTORY_LIST(storeId as string), { params });

    if (res?.data?.data) {
      getResult(res?.data?.data);
    }

    if (res.data?.metadata) {
      setMetadata(res.data.metadata);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    console.log({ key });
    if (key === InventoryStatusEnum.IN_STOCK.toString()) {
      setParams({
        ...params,
        paginationMetadataStyle: "body",
        page: 1,
        state: STATE_STOCK.IN_STOCK,
      });
    }
    if (key === InventoryStatusEnum.OUT_OF_STOCK.toString()) {
      setParams({
        ...params,
        paginationMetadataStyle: "body",
        page: 1,
        state: STATE_STOCK.OUT_OF_STOCK,
      });
    }
    if (key === InventoryStatusEnum.RUN_OUT_SOON.toString()) {
      setParams({
        ...params,
        paginationMetadataStyle: "body",
        page: 1,
        state: STATE_STOCK.RUN_OUT_SOON,
      });
    }
  };

  const search = debounce(e => {
    const value = e.target.value;
    setParams({
      ...params,
      search_value: trim(value),
    });
  }, 500);

  const handleChangePagination = (page: number, pageSize: number) => {
    setPage(page);
    setParams({
      ...params,
      page,
      perPage: pageSize,
    });
  };
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
    setPage(current);
    setParams({
      ...params,
      page: current,
      perPage: pageSize,
    });
  };

  const handleCancel = () => {
    setOpenModal(false);
    form.resetFields();
  };

  const handleUpdateQuantity = async (values: any) => {
    const { updated_quantity } = values;
    const { productId, key } = currentSelect;
    try {
      setLoading(true);
      let body = {
        product_id: productId,
        item_id: key,
        updated_quantity: Number(updated_quantity),
      };

      const response = await defaultAxios.put(`${UPDATE_INVENTORY_STOCK(storeId as string)}`, body);
      console.log({ response });
      if (!response?.data) {
        throw response;
      }
      await getListInventory();
      await getCountAll();
      setOpenModal(false);
      form.resetFields();
      message.success("Update product stock quantity successfuly!");
    } catch (error) {
      message.error("Update product stock quantity fail!");
    } finally {
      setLoading(false);
    }
  };

  const Tabs = [
    {
      title: "In-stock",
      key: InventoryStatusEnum.IN_STOCK.toString(),
      children: <span>{`(${total.total1})`}</span>,
    },

    {
      title: "Run-out soon",
      key: InventoryStatusEnum.RUN_OUT_SOON.toString(),
      children: <span>{`(${total.total2})`}</span>,
    },
    {
      title: "Out-of-stock",
      key: InventoryStatusEnum.OUT_OF_STOCK.toString(),
      children: <span>{`(${total.total3})`}</span>,
    },
  ];

  const validateQuantity = (_: any, value: any) => {
    if (Number(value) === currentSelect.quantity) {
      return Promise.reject(new Error("The stock quantity not equal to the current quantity"));
    }
    if (value && new BigNumber(value).gte(0)) {
      return Promise.resolve();
    }
    if (!value) {
      return Promise.resolve();
    }

    if (isNaN(value)) {
      return Promise.reject(new Error("The stock quantity only number"));
    }

    return Promise.reject(new Error("The stock quantity greater than or equal to 0"));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>Inventory Management</div>
      </div>
      <CustomInput
        onChange={event => search(event)}
        onBlur={event => search(event)}
        className={styles.inputSearch}
        type="search"
        placeholder="Search for product name, ID"
      />
      <div className={styles.productPanel}>
        <CustomTabs tabStyle={styles.customTab} activeTab={activeTab} onChange={handleTabChange} tabs={Tabs}>
          <div className={styles.tabContent}>
            <CustomTable
              pagination={false}
              columns={columns}
              dataSource={data}
              expandable={{
                expandIcon: ({ expanded, onExpand, record }) => {
                  if (record?.children?.length > 0) {
                    let icon = expanded ? (
                      <MinusOutlined onClick={e => onExpand(record, e)} />
                    ) : (
                      <PlusOutlined onClick={e => onExpand(record, e)} />
                    );
                    if (record.isParent) {
                      return icon;
                    }

                    return null;
                  } else {
                    return null;
                  }
                },
              }}
            />
          </div>
        </CustomTabs>
        <div className={styles.paginationWrapper}>
          <CustomPagination
            current={page}
            defaultCurrent={1}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            onChange={handleChangePagination}
            total={metadata["x-total-count"]}
          />
        </div>
      </div>
      <CustomModal
        maskClosable={false}
        classBottom={styles.bottomModal}
        footer={<></>}
        classTitle={styles.titleModalChooseStore}
        title="Update Product Stock Quantity"
        open={openModal}
        onCancel={handleCancel}
      >
        <Form id="update-stock" form={form} onFinish={handleUpdateQuantity} style={{ marginTop: 32 }}>
          <CustomInput
            label="Stock Quantity"
            rules={[
              {
                required: true,
                message: "Please enter stock quantity",
              },
            ]}
            name="updated_quantity"
            placeholder="Enter quantity"
            onWheel={(e: any) => e.target.blur()}
            onChange={event => filterECharacterInputNumber("updated_quantity", form, event)}
          />
          <div className={styles.groupButton}>
            <div className={styles.buttonWrapper} style={loading ? { cursor: "no-drop" } : { cursor: "pointer" }}>
              <div className={styles.returnButton} onClick={loading ? undefined : handleCancel}>
                <GradientText text="Return" />
              </div>
            </div>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className={styles.btnyellowtable}
              shape="round"
              size="large"
            >
              Update
            </Button>
          </div>
        </Form>
      </CustomModal>
    </div>
  );
};

export default InventoryManagement;
