import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import _, { reverse } from "lodash";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import CustomModal from "../../commons/components/CustomModal/CustomModal";
import CustomTable from "../../commons/components/CustomTable";
import GradientText from "../../commons/components/GradientText/GradientText";
import { INVENTORY_LOG, INVENTORY_PROD_DETAIL, UPDATE_INVENTORY_STOCK } from "../../commons/constants/api-urls";
import { Inventory } from "../../commons/resources";
import defaultAxios from "../../commons/utils/axios";
import { STATUS_CODE } from "../Notification/Notification";
import styles from "./InventoryLog.module.scss";
import { filterECharacterInputNumber } from "../../commons/utils/functions/integerOnly";

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

const InventoryLog: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const { storeId, prodId } = useParams<{ storeId: string; prodId: string }>();
  const [prodDetail, setProdDetail] = useState<any>([]);
  const [form] = Form.useForm<{}>();
  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState<any[]>([]);
  const [currentSelect, setCurrentSelect] = useState({
    productId: 0,
    key: 0,
    quantity: 0,
  });

  useEffect(() => {
    getDetailProd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHistories = async () => {
    try {
      setLoading(true);
      let params = { page: 1, perPage: 1000, paginationMetadataStyle: "body" };
      const res = await defaultAxios.get<any>(INVENTORY_LOG(storeId as string, prodId as string), {
        params,
      });
      if (res.data?.items && res.status === STATUS_CODE.SUCCESS) {
        setHistories(reverse(res.data?.items));
      }
    } catch (error) {}
  };

  const getDetailProd = async () => {
    try {
      setLoading(true);
      const res = await defaultAxios.get<any>(INVENTORY_PROD_DETAIL(storeId as string, prodId as string));
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        getResult([res.data]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const columnsLog: ColumnsType<any> = [
    {
      title: "Update Date",
      dataIndex: "update_time",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY hh:mm A"),
    },
    {
      title: "Product ID",
      dataIndex: "prodId",
      render: () => prodId,
    },
    {
      title: "Product name",
      render: () => prodDetail[0]?.name,
    },
    {
      title: "Attribute & variations",
      dataIndex: "attributes",
      render: (text: string, record: any) => `${record?.item?.attribute_name}: ${record?.item?.attribute_value}`,
    },
    {
      title: "Previous Quantity",
      dataIndex: "previous_quantity",
    },
    {
      title: "Update Value",
      dataIndex: "updated_quantity",
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: "Product ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <span style={{ marginLeft: 12 }}>{text}</span>,
    },
    {
      title: "Product name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Attribute & variations",
      dataIndex: "attributes",
      key: "address",
    },
    {
      title: "Current Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total Sold",
      dataIndex: "total_sold",
      key: "total_sold",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record: any) => {
        return (
          <div className={styles.actions} style={{ cursor: "pointer" }}>
            <div className={styles.edit}>
              <Inventory
                onClick={() => {
                  setOpenModal(true);
                  setCurrentSelect(record);
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
        attributes: `${items[0]?.attribute_name}: ${items[0]?.attribute_value}`,
        quantity: items[0]?.current_quantity,
        total_sold: items[0]?.item_sales,
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
                  attributes: `${item?.attribute_name}: ${item?.attribute_value}`,
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
    setProdDetail(res);
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
      if (!response?.data) {
        throw response;
      }
      setOpenModal(false);
      await getHistories();
      await getDetailProd();
      form.resetFields();
      message.success("Update product stock quantity successfuly!");
    } catch (error) {
      message.error("Update product stock quantity fail!");
    } finally {
      setLoading(false);
    }
  };

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

    return Promise.reject(new Error("The stock quantity greater than or equal to 0"));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>
          {prodDetail[0]?.id} - {prodDetail[0]?.name}
        </div>
      </div>
      <CustomTable
        pagination={false}
        columns={columns}
        dataSource={prodDetail}
        loading={loading}
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
      <div style={{ marginTop: 36 }}></div>
      <CustomTable pagination={false} columns={columnsLog} dataSource={histories} loading={loading} />
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
              { validator: validateQuantity },
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

export default InventoryLog;
