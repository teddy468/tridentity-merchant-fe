import { Button, PaginationProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import CustomPagination from "../../commons/components/CustomPagination";
import CustomTable from "../../commons/components/CustomTable";
import {
  DELETE_MERCHANT_CAMPAIGN_PRODUCTS,
  LP_RATE,
  MERCHANT_CAMPAIGN_DETAIL,
  MERCHANT_CAMPAIGN_ORDERS,
  MERCHANT_CAMPAIGN_PRODUCTS
} from "../../commons/constants/api-urls";
import { navigations } from "../../commons/constants/routers";
import useFetch from "../../commons/hooks/useFetch";
import useFetchList from "../../commons/hooks/useFetchList";
import useToast from "../../commons/hooks/useToast";
import { EditIcon, TrashIcon } from "../../commons/resources";
import defaultAxios from "../../commons/utils/axios";
import { format2Digit, formatLP } from "../../commons/utils/functions/formatPrice";
import { STATUS_CODE } from "../Notification/Notification";
import { getOrderStatus } from "../OrderTracking";
import { Campaign } from "./index";
import ModalCreateProduct from "./ModalCreateProduct";
import styles from "./product-management.module.scss";

interface DataType {
  key: React.Key;
  name: string;
  product_id: number;
  id: number;
  total_lp: number;
  single_lp: number;
  remain_budget: number;
  status: string;
  product: Product;
}

export interface Product {
  id: number;
  campaign_id: number;
  product_id: number;
  quantity: number;
  single_lp_amount: number;
  lp_amount: number;
  used_lp_amount: number;
  status: number;
  product: { name: string };
}

interface DataTypeOrder {
  key: React.Key;
  order_id: string;
  phone_number: string;
  address: string;
  status: string;
  amount: number;
  extra_lp: number;
  profit: number;
  time: string;
}

interface Order {
  id: string;
  phone: string;
  address: string;
  status: string;

  subtotal: number;
  extra_lp: number;
  net_amount: number;

  order_date: string
}

const CampaignSummaryComp: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");

  const [pageOrder, setPageOrder] = useState(1);
  const [perPageOrder, setPerPagOrder] = useState(10);
  const [orderId, setOrderId] = useState("");
  const toast = useToast();

  const { id } = useParams<{ id: string }>();

  const [selectedProduct, setSelectedProduct] = useState<DataType>();
  const [editedProduct, setEditedProduct] = useState<Product | undefined>(undefined);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);

  const { data: campaignDetail } = useFetch<Campaign>(MERCHANT_CAMPAIGN_DETAIL(id ? id : ""));
  const [exchangeRate, setExchangeRate] = useState<any>({});

  const params = {
    page: page,
    perPage: perPage,
    paginationMetadataStyle: "body",
    keyword: keyword,
  };
  const {
    data: products,
    total,
    refresh,
  } = useFetchList<Product>(MERCHANT_CAMPAIGN_PRODUCTS(id ? id : ""), params);

  const timeline = campaignDetail ? (dayjs(campaignDetail.start_date).format("DD/MM/YYYY") + " - " + dayjs(campaignDetail.end_date).format("DD/MM/YYYY"))
    : "";

  const productData: DataType[] = useMemo(() => {
    if (products) {
      return products.map(product => ({
        key: product.id.toString(),
        name: product.product.name,
        remain_quantity: Math.floor((product.lp_amount - product.used_lp_amount) / product.single_lp_amount),
        remain_budget: (product.lp_amount - product.used_lp_amount),
        product_id: product.product_id,
        id: product.id,
        status: product.status === 2 ? "Draft" : (product.status === 1 ? "Active" : "Inactive"),
        total_lp: Number(product.lp_amount),
        product: product,
        single_lp: product.single_lp_amount,
      }));
    }

    return [];
  }, [products]);

  const handleDeleteProduct = (product: DataType) => {
    console.log(product);
    setSelectedProduct(product);
    setOpenConfirmPopup(true);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Product name",
      dataIndex: "name",
      render: (_, record) => {
        return (
          <div className={`${styles.product}`}>
            <div className={styles.productName}>{record.name}</div>
          </div>
        );
      },
    },
    {
      title: "Product ID",
      dataIndex: "product_id",
      render: (text, record) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Remain Qty.",
      dataIndex: "remain_quantity",
      render: (text, record) => {
        return <div>{text || 0}</div>;
      },
    },
    {
      title: "Loyalty point Budget",
      dataIndex: "total_lp",
      render: (text, record) => {
        return <div>{formatLP(text)}</div>;
      },
    },
    {
      title: "Remaining Budget",
      dataIndex: "remain_budget",
      render: (text, record) => {
        return <div>{format2Digit(text)}</div>;
      },
    },
    {
      title: "Timeline",
      key: "timeline",
      render: (text, record) => {
        return <div>{timeline}</div>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <div className={`${styles.pointer} ${text === "Inactive" ? styles.textInactive : styles.textActive}`}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className={styles.actions}>
          <div className={styles.edit}>
            <EditIcon onClick={() => {
              setEditedProduct(record.product);
              setShowModalCreate(true);
            }} />
          </div>
          {record.status !== "Inactive" && <div className={styles.delete} onClick={() => handleDeleteProduct(record)}>
            <TrashIcon />
          </div>}
        </div>
      ),
    },
  ];

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
    setPerPage(pageSize || 10);
  };

  const onShowSizeChangeOrder: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
    setPerPagOrder(pageSize || 10);
  };

  const paramOrder = {
    page: pageOrder,
    perPage: perPageOrder,
    paginationMetadataStyle: "body",
    keyword: orderId,
  };
  const {data: orders} = useFetchList<Order>(MERCHANT_CAMPAIGN_ORDERS(id ? id : ""), paramOrder)
  const mockData : DataTypeOrder[] = useMemo(()=> {
    if (orders) {
      return orders.map((order, index) => ({
        key: order.id,
        order_id: order.id,
        address: order.address,
        phone_number: order.phone,
        status: getOrderStatus(Number(order.status)),
        amount: order.subtotal,
        extra_lp: order.extra_lp,
        profit: order.net_amount,
        time: moment(order.order_date).format("DD/MM/yyyy HH:mm")
      }))
    }
    return []
  } , [orders])

  useEffect(() => {
    getExchangeRate();
  }, []);

  const amountToSingaporeDollar = useMemo(() => {
    return (inputAmount: number) => {
      return new BigNumber(inputAmount)
        .multipliedBy(exchangeRate?.sgd_rate)
        .div(exchangeRate?.lp_rate)
        .toFixed(2, 1);
    };
  }, [exchangeRate?.sgd_rate, exchangeRate?.lp_rate]);

  const getExchangeRate = async () => {
    try {
      const res = await defaultAxios.get(LP_RATE);
      if (res.data && res.status === STATUS_CODE.SUCCESS) {
        setExchangeRate(res.data);
      }
    } catch (error) {}
  };

  const columnOrder: ColumnsType<DataTypeOrder> = [
    {
      title: "Order Id",
      dataIndex: "order_id",
      render: (_, record) => {
        return (
          <div className={`${styles.product}`}>
            <div className={styles.productName}>{record.order_id}</div>
          </div>
        );
      },
    },
    {
      title: "Phone number",
      dataIndex: "phone_number",
      render: (text, record) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Delivery address",
      dataIndex: "address",
      render: (text, record) => {
        return <div>{text || 0}</div>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return <div className={styles.textActive}>{text || 0}</div>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => {
        return <div>{format2Digit(text)}</div>;
      },
    },
    {
      title: "Extra LP",
      dataIndex: "extra_lp",
      render: (text, record) => {
        return <div>
          <span className={styles.textActive}>{format2Digit(text)} <span style={{color: "white"}}> LP (S${format2Digit(amountToSingaporeDollar(Number(text)))})</span></span>
        </div>;
      },
    },
    {
      title: "Profit",
      dataIndex: "profit",
      render: (text, record) => {
        return (
          <div>
            S$ {format2Digit(text)}
          </div>
        );
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (text, record) => {
        return (
          <div>
            {text}
          </div>
        );
      },
    },
  ];

  const deleteProduct = async (productId: number) => {
    if (productId) {
      try {
        await defaultAxios.delete(DELETE_MERCHANT_CAMPAIGN_PRODUCTS(id ? id : 0, productId));
        toast.success("Delete product success");
        refresh();
      } catch (err) {
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
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <Button type={"primary"} onClick={()=> {navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_DETAIL(id ? id : ""))}}>Back</Button>
      </div>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{campaignDetail?.name} Campaign Summary</div>
      </div>

      <div className={styles.titleWrapper}>
        <div className={styles.title}>Product Summary</div>
      </div>

      <CustomInput
        onChange={event => setKeyword(event.target.value)}
        onBlur={event => setKeyword(event.target.value.trim())}
        className={styles.inputSearch}
        type="search"
        placeholder="Search for Product"
      />
      <div className={styles.productPanel}>
        <div style={{ float: "right", marginBottom: 20 }}>
          <CustomPagination
            defaultCurrent={1}
            showSizeChanger
            total={total}
            onChange={page => setPage(page)}
            onShowSizeChange={onShowSizeChange}
          />
        </div>
        <CustomTable pagination={false} columns={columns} dataSource={productData} />
      </div>
      <ModalCreateProduct openModal={showModalCreate} onCancel={() => setShowModalCreate(false)}
                          storeId={campaignDetail?.merchant_store_id ? campaignDetail?.merchant_store_id : 0}
                          campaignId={id ? Number(id) : 0}
                          lpAmount={campaignDetail?.lp_amount ? campaignDetail.lp_amount : 0}
                          onSuccess={refresh}
                          editedProduct={editedProduct}
      />

      <ConfirmPopup
        open={openConfirmPopup}
        onCancel={() => setOpenConfirmPopup(false)}
        title="Delete Product"
        description={`Do you want to delete ${selectedProduct?.name}`}
        onConfirm={() => {
          deleteProduct(selectedProduct?.product_id ? selectedProduct?.product_id : 0).then(() => {
            setOpenConfirmPopup(false);
          });
        }}
      />


      <div className={styles.titleWrapper}>
        <div className={styles.title}>Order Summary</div>
      </div>

      <CustomInput
        onChange={event => setOrderId(event.target.value)}
        onBlur={event => setOrderId(event.target.value.trim())}
        className={styles.inputSearch}
        type="search"
        placeholder="Search for Order Id"
      />
      <div className={styles.productPanel}>
        <div style={{ float: "right", marginBottom: 20 }}>
          <CustomPagination
            defaultCurrent={1}
            showSizeChanger
            total={10}
            onChange={page => setPageOrder(page)}
            onShowSizeChange={onShowSizeChangeOrder}
          />
        </div>
        <CustomTable pagination={false} columns={columnOrder} dataSource={mockData} />
      </div>
    </div>
  );
};

export default CampaignSummaryComp;
