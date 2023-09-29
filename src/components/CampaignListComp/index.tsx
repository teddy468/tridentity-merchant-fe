import { PaginationProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import CustomPagination from "../../commons/components/CustomPagination";
import CustomTable from "../../commons/components/CustomTable";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import { GET_MERCHANT_CAMPAIGN, MERCHANT_CAMPAIGN_DETAIL } from "../../commons/constants/api-urls";
import { navigations } from "../../commons/constants/routers";
import useFetchList from "../../commons/hooks/useFetchList";
import useToast from "../../commons/hooks/useToast";
import { EditIcon, TrashIcon } from "../../commons/resources";
import defaultAxios from "../../commons/utils/axios";
import { formatLP } from "../../commons/utils/functions/formatPrice";
import { AppContext } from "../../contexts/AppContext";
import ModalCreateCampaign from "./ModalCreateCampaign";
import styles from "./product-management.module.scss";

interface DataType {
  key: React.Key;
  name: string;
  store_name: string;
  id: number;
  total_lp: number;
  remaining_lp: number;
  timeline: string;
  status: string;
  campaign: Campaign;
}

export interface Campaign {
  create_time: string;
  start_date: string;
  end_date: string;
  update_time: string;
  extra_lp: number;
  id: number;
  lp_amount: number;
  merchant_store_id: number;
  name: string;
  store: { id: number; name: string };
  used_lp_amount: number;
  status: number;
}

const CampaignListComp: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [keyWord, setKeyword] = useState("");
  const { user } = useContext(AppContext);
  const toast = useToast();

  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>(undefined);
  const [editedCampaign, setEditedCampaign] = useState<Campaign | undefined>(undefined);

  const [showModalCreate, setShowModalCreate] = useState(false);

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
    setPerPage(pageSize || 10);
    setPage(current);
  };

  const handleDeleteProduct = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setOpenConfirmPopup(true);
  };

  const params = {
    page: page,
    perPage: perPage,
    paginationMetadataStyle: "body",
    keyword: keyWord,
  };
  const {
    data: campaigns,
    total,
    refresh: refreshCampaign,
  } = useFetchList<Campaign>(GET_MERCHANT_CAMPAIGN(user?.merchantIds ? user.merchantIds[0] : -1), params);

  const data: DataType[] = useMemo(() => {
    if (campaigns) {
      return campaigns.map(campaign => ({
        key: campaign.id.toString(),
        name: campaign.name,
        store_name: campaign.store.name,
        status: campaign.status === 2 ? "Draft" : campaign.status === 1 ? "Active" : "Inactive",
        id: campaign.id,
        total_lp: campaign.lp_amount,
        remaining_lp: campaign.lp_amount - campaign.used_lp_amount,
        timeline:
          dayjs(campaign.start_date).format("DD/MM/YYYY") + " - " + dayjs(campaign.end_date).format("DD/MM/YYYY"),
        campaign: campaign,
      }));
    }
    return [];
  }, [campaigns]);

  const deleteCampaign = async (id: number) => {
    if (id) {
      try {
        await defaultAxios.delete(MERCHANT_CAMPAIGN_DETAIL(id));
        toast.success("Delete campaign success");
        refreshCampaign();
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

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "no",
      render: (text, record, index) => {
        return params.page === 1 ? index + 1 : (params.page - 1) * params.perPage + (index + 1);
      },
    },
    {
      title: "Campaign name",
      dataIndex: "name",
      render: (_, record) => {
        return (
          <div
            className={`${styles.product} ${styles.pointer}`}
            onClick={() => navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_DETAIL(record.id))}
          >
            {/* <img src={record.images[0]} alt={record.name} /> */}
            <div className={styles.productName}>{record.name}</div>
          </div>
        );
      },
    },
    {
      title: "Store",
      dataIndex: "store_name",
      render: (text, record) => {
        return (
          <div
            onClick={() => navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_DETAIL(record.id))}
            className={styles.pointer}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Total LP",
      dataIndex: "total_lp",
      render: (text, record) => {
        return (
          <div
            onClick={() => navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_DETAIL(record.id))}
            className={styles.pointer}
          >
            {formatLP(text || 0)}
          </div>
        );
      },
    },
    {
      title: "Remaining LP",
      dataIndex: "remaining_lp",
      render: (text, record) => {
        return (
          <div
            onClick={() => navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_DETAIL(record.id))}
            className={styles.pointer}
          >
            {formatLP(text)}
          </div>
        );
      },
    },
    {
      title: "Timeline",
      dataIndex: "timeline",
      render: (text, record) => {
        return (
          <div
            onClick={() => navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_DETAIL(record.id))}
            className={styles.pointer}
          >
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
          <div
            onClick={() => navigate(navigations.LP_MEMBER_SHIP.CAMPAIGN_DETAIL(record.id))}
            className={`${styles.pointer} ${
              text === "Inactive" ? styles.textInactive : text === "Active" ? styles.textActive : ""
            }`}
          >
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
                setEditedCampaign(record.campaign);
                setShowModalCreate(true);
              }}
            />
          </div>
          <div className={styles.delete} onClick={() => handleDeleteProduct(record.campaign)}>
            <TrashIcon />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{`Campaign list`}</div>
        <PrimaryButton
          className={styles.addProductBtn}
          onClick={() => {
            setEditedCampaign(undefined);
            setShowModalCreate(true);
          }}
        >
          Create new campaign
        </PrimaryButton>
      </div>
      <CustomInput
        onChange={event => setKeyword(event.target.value)}
        onBlur={event => setKeyword(event.target.value.trim())}
        className={styles.inputSearch}
        type="search"
        placeholder="Search for Campaign"
      />
      <div className={styles.productPanel}>
        <div style={{ float: "right", marginBottom: 20 }}>
          <CustomPagination
            defaultCurrent={1}
            total={total}
            showSizeChanger
            onChange={page => setPage(page)}
            current={page}
            onShowSizeChange={onShowSizeChange}
          />
        </div>
        <CustomTable pagination={false} columns={columns} dataSource={data} />
      </div>
      <ModalCreateCampaign
        openModal={showModalCreate}
        onCancel={() => setShowModalCreate(false)}
        onSuccess={() => refreshCampaign()}
        editedCampaign={editedCampaign}
      />
      <ConfirmPopup
        open={openConfirmPopup}
        onCancel={() => setOpenConfirmPopup(false)}
        title="Deactive Campaign"
        description={`Do you want to deactive "${selectedCampaign?.name}"`}
        onConfirm={() => {
          deleteCampaign(selectedCampaign?.id ? selectedCampaign?.id : 0).then(() => {
            setOpenConfirmPopup(false);
          });
        }}
      />
    </div>
  );
};

export default CampaignListComp;
