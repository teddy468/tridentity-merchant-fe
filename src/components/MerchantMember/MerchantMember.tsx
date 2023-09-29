import { PaginationProps, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import ConfirmPopup from "../../commons/components/ConfirmPopup/ConfirmPopup";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import CustomPagination from "../../commons/components/CustomPagination";
import CustomTable from "../../commons/components/CustomTable";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";

import { EditIcon, SearchNormalIcon, TrashIcon } from "../../commons/resources";
import AddNewMember from "./AddNewMember/AddNewMember";
import styles from "./MerchantMember.module.scss";
import CustomIcon from "../../commons/components/CustomIcon/CustomIcon";
import { DELETE_MEMBER_MERCHANT, MERCHANT_MEMBER_LIST } from "../../commons/constants/api-urls";
import useFetchList from "../../commons/hooks/useFetchList";
import defaultAxios from "../../commons/utils/axios";
import { AppContext } from "../../contexts/AppContext";
interface DataType {
  key: React.Key;
  email: string;
  phone: number;
  merchant_stores_ids: number[];
  id: number;
  status: number;
  create_date: string;
  merchant_member_id: number;
}

const MerchantMember: React.FC = () => {
  const { store } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MerchantMember>();
  const [selectedUserToDelete, setSelectedUserToDelete] = useState<number>();
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [openAddNewMemberPopup, setOpenAddNewMemberPopup] = useState(false);

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
    setPerPage(pageSize || 10);
  };

  const { data, total, refresh } = useFetchList<any>(MERCHANT_MEMBER_LIST(), {
    page,
    perPage,
    status: 1,
    search: keyword.trim(),
  });

  const dataTableMember = useMemo(() => {
    if (!data) return [];
    return data.map(item => ({
      key: item.id,
      email: item.email,
      phone: item.phone,
      id: item.id,
      status: item.status,
      create_time: item.create_time,
      merchant_stores_ids: item.storeIds,
      merchant_member_id: item.id,
    }));
  }, [data]);

  const handleCancel = () => {
    setOpenAddNewMemberPopup(false);
    if (isEdit) {
      setIsEdit(false);
      setSelectedUser(undefined);
    }
  };

  const handleEdit = (member: MerchantMember) => {
    setSelectedUser(member);
    setOpenAddNewMemberPopup(true);
    setIsEdit(true);
  };
  const handleDelete = (memberId: number) => {
    setSelectedUserToDelete(memberId);
    setOpenConfirmPopup(true);
  };

  async function handleDeleteMember() {
    setOpenConfirmPopup(false);
    try {
      const bodyDeleteMember = {
        status: 0,
        merchant_member_id: Number(selectedUserToDelete),
      };
      await defaultAxios.patch(DELETE_MEMBER_MERCHANT(), bodyDeleteMember);
      message.success("Delete member successfully");
      refresh();
    } catch (error) {
      message.error("Delete member failed");
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "no",
      width: 60,
      render: (text, record, index) => {
        return page === 1 ? index + 1 : (page - 1) * perPage + (index + 1);
      },
    },
    {
      title: "Store Name",
      dataIndex: "merchant_stores_ids",
      render: (text, record) => {
        return (
          <div className={`${styles.product} ${styles.pointer}`}>
            {store.data.find(item => item.id === record.merchant_stores_ids[0])?.name}
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => {
        return <div className={`${styles.product} ${styles.pointer}`}>{text}</div>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return <div className={text === 1 ? styles.active : styles.inactive}>{text === 1 ? "Active" : "Inactive"}</div>;
      },
    },
    {
      title: "Date created",
      dataIndex: "create_time",
      render: (text, record) => {
        return (
          <div className={styles.pointer}>
            {moment(text).format("DD/MM/YYYY") + ", " + moment(text).format("HH:mm")}
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
            <EditIcon onClick={() => handleEdit(record)} />
          </div>
          <div className={styles.delete} onClick={() => handleDelete(record.merchant_member_id)}>
            <TrashIcon />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>Merchant Member</div>
        <PrimaryButton className={styles.addProductBtn} onClick={() => setOpenAddNewMemberPopup(true)}>
          Add new member
        </PrimaryButton>
      </div>
      <CustomInput
        onChange={event => setKeyword(event.target.value)}
        onBlur={event => setKeyword(event.target.value.trim())}
        className={styles.inputSearch}
        type="search"
        placeholder="Search for member"
        prefix={<CustomIcon icon={SearchNormalIcon} width={20} stroke="currentColor" />}
      />
      <div className={styles.productPanel}>
        <div className={styles.paginationWrapper}>
          <CustomPagination
            defaultCurrent={1}
            onChange={page => setPage(page)}
            showSizeChanger
            total={total}
            onShowSizeChange={onShowSizeChange}
          />
        </div>
        <CustomTable pagination={false} columns={columns} dataSource={dataTableMember} />
      </div>
      <AddNewMember
        member={selectedUser}
        open={openAddNewMemberPopup}
        isEdit={isEdit}
        onCancel={handleCancel}
        refresh={refresh}
      />
      <ConfirmPopup
        open={openConfirmPopup}
        onCancel={() => {
          setOpenConfirmPopup(false);
          setSelectedUser(undefined);
        }}
        title="Delete member"
        description={`Are you sure you want to delete ${selectedUser?.email}?`}
        onConfirm={() => {
          handleDeleteMember();
        }}
      />
    </div>
  );
};

export default MerchantMember;
