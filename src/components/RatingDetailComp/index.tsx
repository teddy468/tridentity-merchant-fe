import { Avatar, Rate } from "antd";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { RATE_DETAIL_URL } from "../../commons/constants/api-urls";
import { navigations } from "../../commons/constants/routers";
import useFetch from "../../commons/hooks/useFetch";
import "./index.scss";
import styles from "./product-management.module.scss";

const RatingDetailComp: React.FC = () => {
  const navigate = useNavigate();

  const { storeId, id } = useParams<{ storeId: string, id: string }>();

  const { data } = useFetch<Rate>(id ? RATE_DETAIL_URL(id) : "");

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{`Rating detail`}</div>
        <div className={`${styles.filters} filters`}>
          <div className="pointer" onClick={() => navigate(navigations.STORES.RATE_MANAGEMENT(storeId ? storeId : ""))}>
            Back
          </div>
        </div>
      </div>

      <div className={styles.productPanel}>
        <div className={styles.userInfo}>
          <div>
            <Avatar size={80} icon={<img src={data?.order.user.avatar} alt={"avatar"} />} />
          </div>
          <div className={styles.detail}>
            <div className={styles.name}>{data?.order.user.full_name}</div>
            <div>
              <Rate disabled value={data?.rating} allowHalf/>
            </div>
            <div className={styles.time}>{data?.create_time ? moment(data?.create_time).format("DD/MM/yyyy") : ""}</div>
          </div>
        </div>
        <div className={styles.feedback}>
          {data?.description}
        </div>
        <div className={styles.images}>
          {data?.data.attachments.map((value, index) => {
            return <img src={value} alt="img" key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingDetailComp;
