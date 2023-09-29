import { Button, Col, PaginationProps, Row } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios/index";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import CustomPagination from "../../commons/components/CustomPagination";
import CustomTable from "../../commons/components/CustomTable";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import {
  DELETE_MERCHANT_CAMPAIGN_PRODUCTS,
  MERCHANT_CAMPAIGN_DETAIL,
  MERCHANT_CAMPAIGN_PRODUCTS,
} from "../../commons/constants/api-urls";
import { navigations } from "../../commons/constants/routers";
import useFetch from "../../commons/hooks/useFetch";
import useFetchList from "../../commons/hooks/useFetchList";
import useToast from "../../commons/hooks/useToast";
import { EditIcon, TrashIcon } from "../../commons/resources";
import defaultAxios from "../../commons/utils/axios";
import { formatLP } from "../../commons/utils/functions/formatPrice";
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

const CampaignDetail: React.FC = () => {
  const navigate = useNavigate();
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");
  const toast = useToast();

  const { id } = useParams<{ id: string }>();

  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DataType>();
  const [editedProduct, setEditedProduct] = useState<Product | undefined>(undefined);

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
    setPerPage(pageSize || 10);
  };

  const handleDeleteProduct = (product: DataType) => {
    console.log(product);
    setSelectedProduct(product);
    setOpenConfirmPopup(true);
  };

  const { data: campaignDetail } = useFetch<Campaign>(MERCHANT_CAMPAIGN_DETAIL(id ? id : ""));

  const params = {
    page: page,
    perPage: perPage,
    paginationMetadataStyle: "body",
    keyword: keyword,
  };
  const { data: products, total, refresh } = useFetchList<Product>(MERCHANT_CAMPAIGN_PRODUCTS(id ? id : ""), params);

  const timeline = campaignDetail
    ? dayjs(campaignDetail.start_date).format("DD/MM/YYYY") +
      " - " +
      dayjs(campaignDetail.end_date).format("DD/MM/YYYY")
    : "";

  const productData: DataType[] = useMemo(() => {
    if (products) {
      return products.map(product => ({
        key: product.id.toString(),
        name: product.product.name,
        remain_quantity: Math.floor((product.lp_amount - product.used_lp_amount) / product.single_lp_amount),
        product_id: product.product_id,
        id: product.id,
        status: product.status === 2 ? "Draft" : product.status === 1 ? "Active" : "Inactive",
        total_lp: Number(product.lp_amount),
        product: product,
        single_lp: product.single_lp_amount,
      }));
    }

    return [];
  }, [products]);

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "no",
      render: (text, record, index) => {
        return params.page === 1 ? index + 1 : (params.page - 1) * params.perPage + (index + 1);
      },
    },
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
            <EditIcon
              onClick={() => {
                setEditedProduct(record.product);
                setShowModalCreate(true);
              }}
            />
          </div>
          {record.status !== "Inactive" && (
            <div className={styles.delete} onClick={() => handleDeleteProduct(record)}>
              <TrashIcon />
            </div>
          )}
        </div>
      ),
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
        <Button
          type={"primary"}
          onClick={() => {
            navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_LIST);
          }}
        >
          Back
        </Button>
      </div>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{`Campaign detail`}</div>
        <PrimaryButton
          className={styles.addProductBtn}
          onClick={() => {
            setEditedProduct(undefined);
            setShowModalCreate(true);
          }}
        >
          Add product
        </PrimaryButton>

        <PrimaryButton
          style={{ marginLeft: "20px" }}
          className={styles.addProductBtn}
          onClick={() => {
            navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_SUMMARY(id ? id : 0));
          }}
        >
          Campaign summary
        </PrimaryButton>
      </div>
      <div className={styles.detail}>
        <Row>
          <Col span={7}>
            <div className={styles.wrapper_detail}>
              <div className={styles.text1}>Campaign name</div>
              <div className={styles.text2}>{campaignDetail?.name}</div>
              <div className={styles.text1}>Total LP</div>
              <div className={styles.text2} style={{ marginBottom: 0 }}>
                {formatLP(campaignDetail?.lp_amount || 0)}
              </div>
            </div>
          </Col>
          <Col span={14}>
            <div className={styles.wrapper_detail}>
              <div className={styles.text1}>Store name</div>
              <div className={styles.text2}>{campaignDetail?.store.name}</div>
              <div className={styles.text1}>Remaining LP for campaign</div>
              <div className={`${styles.text2} ${styles.textActive}`} style={{ marginBottom: 0 }}>
                {campaignDetail && formatLP(campaignDetail.lp_amount - campaignDetail.used_lp_amount)}
              </div>
            </div>
          </Col>
        </Row>
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
      <ModalCreateProduct
        openModal={showModalCreate}
        onCancel={setShowModalCreate}
        storeId={campaignDetail?.merchant_store_id ? campaignDetail?.merchant_store_id : 0}
        campaignId={id ? Number(id) : 0}
        lpAmount={campaignDetail?.lp_amount ? campaignDetail.lp_amount : 0}
        onSuccess={refresh}
        editedProduct={editedProduct}
        productData={productData}
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
    </div>
  );
};

export default CampaignDetail;
