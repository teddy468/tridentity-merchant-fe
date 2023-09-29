import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, MenuProps, message, PaginationProps, Select, Space, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AxiosError, AxiosResponse } from "axios";
import { join, trim } from "lodash";
import moment from "moment";
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UploadIcon } from "../../assets/icons";
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import CustomModal from "../../commons/components/CustomModal/CustomModal";
import CustomPagination from "../../commons/components/CustomPagination";
import { CustomSelect } from "../../commons/components/CustomSelect/CustomSelect";
import CustomTable from "../../commons/components/CustomTable";
import CustomTabs from "../../commons/components/CustomTabs";
import GradientText from "../../commons/components/GradientText/GradientText";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import {
  CLONE_MERCHANTS_PRODUCTS_URL,
  MARK_PRODUCT_SOLD_OUT,
  MERCHANTS_PRODUCTS_APPROVAL_URL,
  MERCHANTS_PRODUCTS_URL,
  PRODUCT_MERCHANT_STORE_SETTINGS_URL,
  PUBLISH_DRAFT_PRODUCT_URL,
  UPDATE_PRODUCT_APPROVAL_URL,
  UPDATE_PRODUCT_URL,
  UPLOAD_PRODUCT_CSV,
  UPLOAD_PRODUCT_JSON,
} from "../../commons/constants/api-urls";
import { ProductStatusEnum } from "../../commons/constants/product";
import { navigations } from "../../commons/constants/routers";
import useFetchList from "../../commons/hooks/useFetchList";
import useToast from "../../commons/hooks/useToast";
import { CloneIcon, EditIcon, TrashIcon } from "../../commons/resources";
import defaultAxios, { uploadAxios } from "../../commons/utils/axios";
import { format2Digit } from "../../commons/utils/functions/formatPrice";
import { AppContext } from "../../contexts/AppContext";
import { ApprovalStatus, ProductActionType } from "../Form/CreateUpdateProductForm/CreateUpdateProductApprovalForm";
import styles from "./product-management.module.scss";
import CustomIconStar from "../CustomIconStar";

interface DataType {
  key: React.Key;
  name: string;
  id: number;
  quantity: number;
  total_sales: number;
  price: number;
  images: string[];
  isFeatured: boolean;
}

interface DataTypeApproval {
  key: React.Key;
  name: string;
  id: number;
  product_id: number;
  total_sales: number;
  description: string;
  type: string;
  update_time: string;
  price: number;
  status: string;
  images: string[];
  isFeatured: boolean;
}

export interface ProductItemApproval {
  id: number;
  type: string;
  update_time: string;
  price: number;
  description: string;
  approval_status: ApprovalStatus;
  product?: Product;
  payload: CreateUpdateProductBody;
  store: Store;
}

interface DataTypeProduct {
  key: React.Key;
  id: number;
  name: string;
}

const params = { perPage: 10, paginationMetadataStyle: "body" };

const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { setCurrentStore, store, currentStore } = useContext(AppContext);
  const [status, setStatus] = useState<string>(ProductStatusEnum.ACTIVE.toString());
  const { storeId } = useParams<{ storeId: string }>();
  const [activeTab, setActiveTab] = useState(ProductStatusEnum.ACTIVE.toString());
  const [perPage, setPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [text, setText] = useState("");
  const [keywordExport, setKeywordExport] = useState("");
  const { data: dataStore, refresh: refreshStore } = store;
  const toast = useToast();
  const [showNote, setShowNote] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    data: productsActive,
    total: totalActive,
    refresh: refreshActive,
  } = useFetchList<ProductItem>(currentStore ? MERCHANTS_PRODUCTS_URL(currentStore.id) : "", {
    ...params,
    page,
    status: ProductStatusEnum.ACTIVE,
    keyword: keyword.trim(),
    perPage,
    sort_by: "create_time",
    order_by: "DESC",
  });

  const {
    data: productsDraft,
    total: totalDraft,
    refresh: refreshDraft,
  } = useFetchList<ProductItem>(currentStore ? MERCHANTS_PRODUCTS_URL(currentStore.id) : "", {
    ...params,
    page,
    status: ProductStatusEnum.DRAFT,
    keyword: keyword.trim(),
    perPage,
    sort_by: "create_time",
    order_by: "DESC",
  });

  const {
    data: productApprovals,
    total: totalApproval,
    refresh: refreshApproval,
  } = useFetchList<ProductItemApproval>(currentStore ? MERCHANTS_PRODUCTS_APPROVAL_URL(currentStore.id) : "", {
    ...params,
    page,
    status: `${ApprovalStatus.PENDING}`,
    keyword: keyword.trim(),
    perPage,
    sort_by: "create_time",
    order_by: "DESC",
  });

  const {
    data: productRejects,
    total: totalReject,
    refresh: refreshReject,
  } = useFetchList<ProductItemApproval>(currentStore ? MERCHANTS_PRODUCTS_APPROVAL_URL(currentStore.id) : "", {
    ...params,
    page,
    status: `${ApprovalStatus.REJECT}`,
    keyword: keyword.trim(),
    perPage,
    sort_by: "create_time",
    order_by: "DESC",
  });

  const paramsExport = { page: 1, perPage: 1000, paginationMetadataStyle: "body" };
  const [openModalExport, setOpenModalExport] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowDraftKeys, setSelectedRowDraftKeys] = useState<React.Key[]>([]);
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<number[]>([]);

  const { data: productsExport } = useFetchList<ProductItem>(
    currentStore && openModalExport ? MERCHANTS_PRODUCTS_URL(currentStore.id) : "",
    {
      ...paramsExport,
      status,
      keyword: keywordExport.trim(),
      sort_by: "create_time",
      order_by: "DESC",
    }
  );

  const dataExport: DataTypeProduct[] = useMemo(() => {
    if (productsExport) {
      return productsExport.map((value, index) => ({
        key: value.id,
        id: value.id,
        name: value.name,
      }));
    }
    return [];
  }, [productsExport]);

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: DataTypeProduct[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedId(selectedRows.map(value => value.id));
  };

  const onSelectChangeDraft = (newSelectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    setSelectedRowDraftKeys(newSelectedRowKeys);
    setSelectedDraftId(selectedRows.map(value => value.id));
  };

  const rowSelectionExport = {
    selectedRowKeys,
    onChange: onSelectChange,

    getCheckboxProps: (record: DataTypeProduct) => ({
      name: record.name.toString(),
    }),
  };

  const columnsExport: ColumnsType<DataTypeProduct> = [
    {
      title: "All product",
      dataIndex: "name",
      render: (_, record) => {
        return <div>{record.name}</div>;
      },
    },
  ];

  const [disableUpload, setDisableUpload] = useState(true);
  const [thumbnail, setThumbnail] = useState<string>("Drag & drop here or browse file");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploadType, setUploadType] = useState<string>("json");
  const [selectProductId, setSelectProductId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [openConfirmDeleteApproval, setOpenConfirmDeleteApproval] = useState(false);
  const [openConfirmPopupSoldout, setOpenConfirmPopupSoldout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedProductApproval, setSelectedProductApproval] = useState<DataTypeApproval>();
  const [form] = Form.useForm<{ merchant_store_ids: string[] }>();

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
    setPerPage(pageSize || 10);
  };
  const storesSelect = useMemo(() => {
    if (dataStore.length > 0) {
      return dataStore.map(item => {
        const res = {
          value: item.id,
          label: trim(item.name),
        };
        return res;
      });
    } else {
      return [];
    }
  }, [dataStore]);

  const [openModal, setOpenModal] = useState(false);
  const [openModalUpload, setOpenModalUpload] = useState(false);

  const deleteProduct = async (productId: string | number) => {
    try {
      const res: AxiosResponse<any> = await defaultAxios.delete(UPDATE_PRODUCT_URL(productId));
      if (!!res?.data) {
        message.success("Delete product successfully");
        refreshActive();
        refreshDraft();
      }
    } catch (error) {
      console.log("delete product error", error);
      message.error("Delete product failed");
    }
  };

  const deleteProductApproval = async (approvalId: string | number) => {
    try {
      const res: AxiosResponse<any> = await defaultAxios.put(UPDATE_PRODUCT_APPROVAL_URL(approvalId), {
        approval_status: ApprovalStatus.DELETE,
      });
      if (!!res?.data) {
        message.success("Delete approval product successfully");
        if (activeTab === ProductStatusEnum.REJECTED.toString()) {
          refreshReject();
        } else {
          refreshApproval();
        }
      }
    } catch (error) {
      console.log("delete approval product error", error);
      message.error("Delete product approval failed");
    }
  };

  const markProductSoldout = async (product: Product) => {
    try {
      const res = await defaultAxios.patch(MARK_PRODUCT_SOLD_OUT(product.id), { is_sold_out: !product.is_sold_out });
      message.success("Mark product sold out successfully");
      refreshActive();
    } catch (error) {
      console.log(error);
      message.error("Mark product sold out failed");
    }
  };

  const featuredProduct = async (productId: string | number, value: boolean) => {
    try {
      const res = await defaultAxios.put(PRODUCT_MERCHANT_STORE_SETTINGS_URL(productId), {
        is_featured: !value,
      });
      if (res) {
        refreshActive();
      }
    } catch (error) {
      console.log("featured product error", error);
      message.error("featured product failed");
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setOpenConfirmPopup(true);
  };

  const handleDeleteProductApproval = (product: DataTypeApproval) => {
    setSelectedProductApproval(product);
    setOpenConfirmDeleteApproval(true);
  };

  const handleMarkProductSoldOut = async (product: Product) => {
    setSelectedProduct(product);
    setOpenConfirmPopupSoldout(true);
  };

  const handleTabChange = (key: string) => {
    setStatus(key);
    setActiveTab(key);
    if (key === ProductStatusEnum.ACTIVE.toString()) {
      refreshActive();
    } else if (key === ProductStatusEnum.DRAFT.toString()) {
      refreshDraft();
    } else if (key === ProductStatusEnum.REJECTED.toString()) {
      refreshReject();
    } else {
      refreshApproval();
    }
  };

  function handleOpenAdminNote(id: number) {
    setShowNote(prev => (prev === id ? null : id));
  }

  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const handleClickStore = async (values: any) => {
    if (loading) return;
    try {
      setLoading(true);
      let body = {
        merchant_store_ids: values.merchant_store_ids,
      };
      const response = await defaultAxios.post(`${CLONE_MERCHANTS_PRODUCTS_URL(selectProductId)}`, body);
      if (!!response?.data) {
        const arrName = values.merchant_store_ids?.map((id: string) => {
          let name = storesSelect.find(item => item.value === (id as any))?.label;
          return name;
        });

        const storeName = join(arrName, " , ");
        setOpenModal(false);
        form.resetFields();
        refreshStore();
        refreshDraft();
        setLoading(false);
        message.success(`Product cloned to ${storeName} draft.`);
      } else {
        setLoading(false);
        message.error("Clone product failed");
      }
    } catch (error) {
      setLoading(false);
      message.error("Clone product failed");
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    form.resetFields();
  };

  const handleCancelUpload = () => {
    setFile(undefined);
    setOpenModalUpload(false);
  };

  const handleCancelExport = () => {
    setOpenModalExport(false);
  };

  const Tabs = [
    {
      title: "Published",
      key: ProductStatusEnum.ACTIVE.toString(),
      children: <span>({totalActive})</span>,
    },

    {
      title: "Draft",
      key: ProductStatusEnum.DRAFT.toString(),
      children: <span> ({totalDraft})</span>,
    },
    {
      title: "Wait for approval",
      key: ApprovalStatus.PENDING.toString(),
      children: <span>({totalApproval})</span>,
    },
    {
      title: "Rejected",
      key: ProductStatusEnum.REJECTED.toString(),
      children: <span>({totalReject})</span>,
    },
  ];

  const dataActive: DataType[] = useMemo(() => {
    return productsActive.map((product: any) => {
      return {
        key: product.id,
        name: product.name,
        images: product.images,
        id: product.id,
        quantity: product.quantity,
        total_sales: product.total_sales,
        price: product.price,
        isFeatured: product.settings["is_featured"],
        is_sold_out: product.is_sold_out,
      };
    });
  }, [productsActive]);

  const dataDraft: DataType[] = useMemo(() => {
    return productsDraft.map((product: any) => {
      return {
        key: product.id,
        name: product.name,
        images: product.images,
        id: product.id,
        quantity: product.quantity,
        total_sales: product.total_sales,
        price: product.price,
        isFeatured: product.settings["is_featured"],
      };
    });
  }, [productsDraft]);

  const dataApproval: DataTypeApproval[] = useMemo(() => {
    return productApprovals.map((approval: ProductItemApproval) => {
      const name =
        approval.type === ProductActionType.PUBLISH
          ? approval.product
            ? approval.product.name
            : ""
          : approval.payload.name;
      const images =
        approval.type === ProductActionType.PUBLISH
          ? approval.product
            ? approval.product.images
            : []
          : approval.payload.images;
      return {
        key: approval.id,
        name: name,
        images: images,
        id: approval.id,
        product_id: approval.product ? approval.product.id : 0,
        description: approval.description,
        update_time: moment(approval.update_time).format("DD/MM/yyyy HH:mm"),
        type: approval.type,
        status:
          approval.approval_status === ApprovalStatus.APPROVE
            ? "Approved"
            : approval.approval_status === ApprovalStatus.PENDING
            ? "Pending"
            : "Rejected",
        quantity: 0,
        total_sales: approval.product ? (approval.product.total_sales ? approval.product.total_sales : 0) : 0,
        price: approval.price,
        isFeatured: approval.payload
          ? approval.payload.settings
            ? approval.payload?.settings["is_featured"]
            : false
          : false,
      };
    });
  }, [productApprovals]);

  const dataReject: DataTypeApproval[] = useMemo(() => {
    return productRejects.map((reject: ProductItemApproval) => {
      const name =
        reject.type === ProductActionType.PUBLISH ? (reject.product ? reject.product.name : "") : reject.payload.name;
      const images =
        reject.type === ProductActionType.PUBLISH
          ? reject.product
            ? reject.product.images
            : []
          : reject.payload.images;
      return {
        key: reject.id,
        name: name,
        images: images,
        id: reject.id,
        product_id: reject.product ? reject.product.id : 0,
        description: reject.description,
        update_time: moment(reject.update_time).format("DD/MM/yyyy HH:mm"),
        type: reject.type,
        status: "Rejected",
        quantity: 0,
        total_sales: reject.product ? (reject.product.total_sales ? reject.product.total_sales : 0) : 0,
        price: reject.price,
        isFeatured: reject.payload
          ? reject.payload.settings
            ? reject.payload?.settings["is_featured"]
            : false
          : false,
      };
    });
  }, [productRejects]);

  const rowSelectionDraft = {
    selectedRowDraftKeys,
    onChange: onSelectChangeDraft,
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Featured",
      width: 100,
      render: (_, record: DataType) => {
        return <CustomIconStar isFeatured={record.isFeatured} onClick={featuredProduct} id={record.id} />;
      },
    },
    {
      title: "Product name",
      dataIndex: "name",
      width: 300,
      render: (_, record) => {
        return (
          <div
            className={`${styles.product} ${styles.pointer}`}
            onClick={() => navigate(navigations.STORES.UPDATE_PRODUCT(currentStore?.id || "", record.id))}
          >
            <img src={record.images[0]} alt={record.name} />
            <div className={styles.productName}>{record.name}</div>
          </div>
        );
      },
    },
    {
      title: "Product ID",
      dataIndex: "id",
      render: (text, record) => {
        return (
          <div
            onClick={() => navigate(navigations.STORES.UPDATE_PRODUCT(currentStore?.id || "", record.id))}
            className={styles.pointer}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Total sold",
      dataIndex: "total_sales",
      render: (text, record) => {
        return (
          <div
            onClick={() => navigate(navigations.STORES.UPDATE_PRODUCT(currentStore?.id || "", record.id))}
            className={styles.pointer}
          >
            {text || 0}
          </div>
        );
      },
    },
    {
      title: "Unit price",
      dataIndex: "price",
      render: (text, record) => {
        return (
          <div
            onClick={() => navigate(navigations.STORES.UPDATE_PRODUCT(currentStore?.id || "", record.id))}
            className={styles.pointer}
          >
            S$ {format2Digit(text)}
          </div>
        );
      },
    },
    {
      width: 250,
      title: "Action",
      key: "action",
      render: (row: Product) => (
        <>
          <div className={styles.actions}>
            <div className={styles.edit}>
              <CloneIcon
                onClick={() => {
                  setSelectProductId(row.id);
                  setOpenModal(true);
                }}
              />
            </div>
            <div className={styles.edit}>
              <EditIcon onClick={() => navigate(navigations.STORES.UPDATE_PRODUCT(currentStore?.id || "", row.id))} />
            </div>
            <div className={styles.delete} onClick={() => handleDeleteProduct(row)}>
              <TrashIcon />
            </div>
            {activeTab === ProductStatusEnum.ACTIVE.toString() && (
              <div
                className={`${styles.soldOut} ${row.is_sold_out && styles.true}`}
                onClick={() => handleMarkProductSoldOut(row)}
              >
                Sold out
              </div>
            )}
          </div>
        </>
      ),
    },
  ];

  const getUrl = (storeId: number, approvalId: number) => {
    return navigations.STORES.UPDATE_PRODUCT_APPROVAL(storeId, approvalId);
  };

  const columnsApproval: ColumnsType<DataTypeApproval> = [
    {
      title: "Request ID",
      dataIndex: "id",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            {text ? text : ""}
          </div>
        );
      },
    },
    {
      title: "Product name",
      dataIndex: "name",
      render: (_, record) => {
        return (
          <div
            className={`${styles.product} ${styles.pointer}`}
            onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))}
          >
            <img src={record.images[0]} alt={record.name} />
            <div className={styles.productName}>{record.name}</div>
          </div>
        );
      },
    },
    {
      title: "Product ID",
      dataIndex: "product_id",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            {text ? text : ""}
          </div>
        );
      },
    },
    {
      title: "Unit price",
      dataIndex: "price",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            S$ {format2Digit(text)}
          </div>
        );
      },
    },
    {
      title: "Last Update",
      dataIndex: "update_time",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          {(record.status === "Pending" || record.status === "Rejected") && (
            <div className={styles.actions}>
              <div className={styles.delete} onClick={() => handleDeleteProductApproval(record)}>
                <TrashIcon />
              </div>
            </div>
          )}
        </>
      ),
    },
  ];
  const columnsReject: ColumnsType<DataTypeApproval> = [
    {
      title: "Request ID",
      dataIndex: "id",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            {text ? text : ""}
          </div>
        );
      },
    },
    {
      title: "Product name",
      dataIndex: "name",
      render: (_, record) => {
        return (
          <div
            className={`${styles.product} ${styles.pointer}`}
            onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))}
          >
            <img src={record.images[0]} alt={record.name} />
            <div className={styles.productName}>{record.name}</div>
          </div>
        );
      },
    },
    {
      title: "Product ID",
      dataIndex: "product_id",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            {text ? text : ""}
          </div>
        );
      },
    },
    {
      title: "Unit price",
      dataIndex: "price",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            S$ {format2Digit(text)}
          </div>
        );
      },
    },
    {
      title: "Last Update",
      dataIndex: "update_time",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Admin Note",
      dataIndex: "description",
      render: (text, record) => {
        return (
          <div onClick={() => handleOpenAdminNote(record.id)} className={styles.pointer}>
            <span className={`${styles.adminNote} ${showNote === record.id && styles.noDot}`}> {text}</span>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <div onClick={() => navigate(getUrl(currentStore?.id || 0, record.id))} className={styles.pointer}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          {(record.status === "Pending" || record.status === "Rejected") && (
            <div className={styles.actions}>
              <div className={styles.delete} onClick={() => handleDeleteProductApproval(record)}>
                <TrashIcon />
              </div>
            </div>
          )}
        </>
      ),
    },
  ];

  const [file, setFile] = useState<File>();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.name.endsWith(`.${uploadType}`)) {
        setErrorMessage(`Select file .${uploadType}`);
        e.target.value = "";
        return;
      } else {
        setFile(file);
        e.target.value = "";
        setErrorMessage("");
      }
    } else {
      toast.error("No file selected");
    }
  };

  useEffect(() => {
    if (file) {
      setThumbnail(file.name);
      setDisableUpload(false);
    } else {
      setThumbnail("Drag & drop here or browse file");
      setDisableUpload(true);
    }
  }, [file]);

  async function onClickExport() {
    const FileDownload = require("js-file-download");

    defaultAxios
      .post(
        `/merchant-management/merchant-stores/${currentStore?.id}/products/export`,
        { productIds: selectedId },
        { responseType: "blob" }
      )
      .then(response => {
        FileDownload(response.data, "product.json");
      });
  }

  async function onClickUpload() {
    if (!file) {
      toast.error("No file selected");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await uploadAxios.post<FormData, AxiosResponse<ImageItem>>(
        uploadType === "json"
          ? UPLOAD_PRODUCT_JSON(currentStore ? currentStore.id : "")
          : UPLOAD_PRODUCT_CSV(currentStore ? currentStore.id : ""),
        formData
      );
      toast.success("Upload success !");
      refreshDraft();
      refreshStore();
      setUploading(false);
      setStatus(ProductStatusEnum.DRAFT.toString());
      setActiveTab(ProductStatusEnum.DRAFT.toString());
      setFile(undefined);
      setOpenModalUpload(false);
    } catch (err: any) {
      console.log(err);
      setFile(undefined);
      const error = (err as AxiosError<any>)?.response?.data;
      const message =
        typeof error?.error.message === "string"
          ? error?.error.message
          : typeof error?.error.message?.[0] === "string"
          ? error.error.message[0]
          : "Upload Fail";
      toast.error(message);
      setUploading(false);
    }
  }

  const downloadTemplateJSON = () => {
    const FileDownload = require("js-file-download");

    defaultAxios.get("/merchant-management/products/upload/template", { responseType: "blob" }).then(response => {
      FileDownload(response.data, "template.json");
    });
  };

  const downloadTemplateCSV = () => {
    const FileDownload = require("js-file-download");

    defaultAxios.get("/merchant-management/products/upload/csv/template", { responseType: "blob" }).then(response => {
      FileDownload(response.data, "template.csv");
    });
  };

  const items = [
    {
      label: "CSV Template",
      key: "csv",
    },
    {
      label: "JSON Template",
      key: "json",
    },
  ];

  const uploadOptions = [
    { value: "csv", label: "Csv" },
    { value: "json", label: "Json" },
  ];

  const handleMenuClick: MenuProps["onClick"] = e => {
    const key = e.key;
    if (key === "json") {
      downloadTemplateJSON();
    } else if (key === "csv") {
      downloadTemplateCSV();
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleChangeUploadOption = (value: string) => {
    setUploadType(value);
    setFile(undefined);
  };

  const clickPublish = async () => {
    try {
      if (selectedDraftId.length === 0) {
        message.error("No product selected !");
        return;
      }
      await defaultAxios.post(PUBLISH_DRAFT_PRODUCT_URL, { ids: selectedDraftId });
      message.success("Wait admin approve your process !");
      setSelectedDraftId([]);
      setSelectedRowDraftKeys([]);
      setActiveTab(ApprovalStatus.PENDING.toString());
      refreshApproval();
    } catch (error) {
      console.log(error);
      message.error("Publish product failed");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setKeyword(text);
    }, 500);

    return () => clearTimeout(timeout);
  }, [text]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);
  const handleTabTotalCounts = (event: any) => {
    setText(event.target.value.trim());
    refreshActive();
    refreshDraft();
    refreshApproval();
    refreshReject();
  };
  const getTotal = useMemo(() => {
    switch (activeTab) {
      case ProductStatusEnum.ACTIVE.toString():
        return totalActive;
      case ProductStatusEnum.DRAFT.toString():
        return totalDraft;
      case ApprovalStatus.PENDING.toString():
        return totalApproval;
      case ProductStatusEnum.REJECTED.toString():
        return totalReject;
    }
  }, [activeTab, totalActive, totalDraft, totalApproval, totalReject]);
  return (
    <div className={styles.wrapper}>
      {uploading && (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      )}
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{`${trim(currentStore?.name)} - Product Management`}</div>
        <div className={styles.uploadBtnWrapper}>
          <button className={styles.btn} onClick={() => setOpenModalUpload(true)}>
            Create product
          </button>
        </div>

        <Dropdown menu={menuProps} className={styles.downButton} trigger={["click"]}>
          <Button>
            <Space>
              Download Template <DownOutlined />
            </Space>
          </Button>
        </Dropdown>

        <PrimaryButton
          style={{ marginRight: "15px" }}
          className={styles.addProductBtn}
          onClick={() => setOpenModalExport(true)}
        >
          Export product
        </PrimaryButton>

        <PrimaryButton
          className={styles.addProductBtn}
          onClick={() => navigate(navigations.STORES.CREATE_PRODUCT(currentStore?.id || ""))}
        >
          Add new product
        </PrimaryButton>
      </div>
      <CustomInput
        onChange={handleTabTotalCounts}
        className={styles.inputSearch}
        type="search"
        placeholder="Search for product name, ID"
      />
      <div className={styles.productPanel}>
        <CustomTabs
          tabStyle={styles.customTab}
          className={"tabProduct"}
          activeTab={activeTab}
          onChange={handleTabChange}
          tabs={Tabs}
        >
          <div className={styles.tabContent}>
            {activeTab === ProductStatusEnum.ACTIVE.toString() && (
              <CustomTable pagination={false} columns={columns} dataSource={dataActive} />
            )}

            {activeTab === ProductStatusEnum.DRAFT.toString() && (
              <CustomTable
                pagination={false}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelectionDraft,
                }}
                columns={columns.filter(item => item.title !== "Featured")}
                dataSource={dataDraft}
              />
            )}

            {activeTab === ApprovalStatus.PENDING.toString() && (
              <CustomTable pagination={false} columns={columnsApproval} dataSource={dataApproval} />
            )}

            {activeTab === ProductStatusEnum.REJECTED.toString() && (
              <CustomTable pagination={false} columns={columnsReject} dataSource={dataReject} />
            )}
          </div>
        </CustomTabs>
        <div className={styles.paginationWrapper}>
          <CustomPagination
            defaultCurrent={1}
            showSizeChanger
            current={page}
            onChange={page => setPage(page)}
            total={getTotal}
            onShowSizeChange={onShowSizeChange}
          />
        </div>
        {activeTab === ProductStatusEnum.DRAFT.toString() && (
          <Button
            size={"large"}
            disabled={selectedDraftId.length === 0}
            onClick={clickPublish}
            className={`${styles.save} ${selectedDraftId.length === 0 ? styles.saveDisable : ""}`}
            style={{ marginTop: "20px" }}
          >
            Publish Product
          </Button>
        )}
      </div>
      <CustomModal
        maskClosable={false}
        classBottom={styles.bottomModal}
        footer={<></>}
        classTitle={styles.titleModalChooseStore}
        title="Choose store to clone this product"
        open={openModal}
        onCancel={handleCancel}
      >
        <div className={styles.textAvailable}>Available stores</div>
        <Form form={form} onFinish={handleClickStore}>
          <CustomSelect
            rules={[
              {
                required: true,
                message: "Please select store",
              },
            ]}
            mode="multiple"
            options={storesSelect}
            name="merchant_store_ids"
          />
          <div className={styles.groupButton}>
            <Button className={styles.buttonText} type="text" onClick={handleCancel}>
              Cancel
            </Button>
            <button type="submit" className={[styles.buttonGreen, loading && styles.loading].join(" ")}>
              Clone to store draft
            </button>
          </div>
        </Form>
      </CustomModal>

      <CustomModal
        maskClosable={false}
        classBottom={styles.bottomModal}
        footer={<></>}
        classTitle={styles.titleModalChooseStore}
        title="Create product"
        open={openModalUpload}
        onCancel={handleCancelUpload}
      >
        <div className={styles.uploadWrapper}>
          <Select
            defaultValue={uploadType}
            className="select-reconciliation"
            style={{ width: "100%" }}
            onChange={handleChangeUploadOption}
            options={uploadOptions}
          />

          <span className={styles.uploadTitle}>Create product from file</span>
          <div className={styles.inputArea}>
            <UploadIcon />
            {thumbnail ? thumbnail : "Drag & drop here or browse file"}
            <input onChange={handleFileChange} type="file" id="choose-file" />
          </div>
          {!!errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        </div>

        <div className={styles.footer}>
          <div className={styles.cancelButton} onClick={handleCancelUpload}>
            <GradientText text={"Cancel"}></GradientText>
          </div>
          <PrimaryButton
            onClick={onClickUpload}
            disabled={disableUpload}
            className={`${styles.confirmButton} ${disableUpload ? styles.btnDisable : ""}`}
          >
            {"Upload"}
          </PrimaryButton>
        </div>
      </CustomModal>

      <CustomModal
        maskClosable={false}
        classBottom={styles.bottomModal}
        footer={<></>}
        classTitle={styles.titleModalChooseStore}
        title="Export product"
        open={openModalExport}
        onCancel={handleCancelExport}
      >
        <div className={styles.uploadWrapper}>
          <CustomInput
            onChange={event => setKeywordExport(event.target.value)}
            onBlur={event => setKeywordExport(event.target.value.trim())}
            className={styles.inputSearch}
            type="search"
            placeholder="Search for product name"
          />

          <CustomTable
            style={{ maxHeight: "400px", overflowY: "scroll" }}
            pagination={false}
            rowSelection={{
              type: "checkbox",
              ...rowSelectionExport,
            }}
            columns={columnsExport}
            dataSource={dataExport}
          />
        </div>

        <div className={styles.footerExport}>
          <Button
            onClick={() => {
              handleCancelExport();
              setSelectedRowKeys([]);
              setSelectedId([]);
            }}
            className={styles.cancel}
          >
            Cancel
          </Button>
          <Button
            type={"primary"}
            onClick={onClickExport}
            disabled={selectedId.length === 0}
            className={`${styles.save} ${selectedId.length === 0 ? styles.saveDisable : ""}`}
          >
            Export
          </Button>
        </div>
      </CustomModal>

      <ConfirmPopup
        open={openConfirmPopupSoldout}
        onCancel={() => setOpenConfirmPopupSoldout(false)}
        title={`Mark product as ${!selectedProduct?.is_sold_out ? "sold out" : "available"}`}
        description={`Do you want to mark ${selectedProduct?.name} as ${
          !selectedProduct?.is_sold_out ? "sold out" : "available"
        } `}
        onConfirm={() => {
          markProductSoldout(selectedProduct!);
          setOpenConfirmPopupSoldout(false);
        }}
      />

      <ConfirmPopup
        open={openConfirmPopup}
        onCancel={() => setOpenConfirmPopup(false)}
        title="Delete Product"
        description={`Do you want to delete ${selectedProduct?.name}`}
        onConfirm={() => {
          deleteProduct(selectedProduct?.id || "");
          setOpenConfirmPopup(false);
        }}
      />

      <ConfirmPopup
        open={openConfirmDeleteApproval}
        onCancel={() => setOpenConfirmDeleteApproval(false)}
        title="Delete Product Approval Request"
        description={`Do you want to delete approval request ${selectedProductApproval?.id}`}
        onConfirm={() => {
          deleteProductApproval(selectedProductApproval?.id || "");
          setOpenConfirmDeleteApproval(false);
        }}
      />
    </div>
  );
};

export default ProductManagement;
