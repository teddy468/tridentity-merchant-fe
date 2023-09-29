import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import Papa from "papaparse";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CustomTabs from "../../commons/components/CustomTabs";
import {
  REPORT_BEST_SELLER,
  REPORT_CHART,
  REPORT_ORDER_LIST,
  REPORT_TOTAL_INFO,
} from "../../commons/constants/api-urls";
import { SelectDate } from "../../commons/constants/product";
import defaultAxios from "../../commons/utils/axios";
import { format2Digit, formatLP } from "../../commons/utils/functions/formatPrice";
import { AppContext } from "../../contexts/AppContext";
import OrderListInReport from "../../pages/OrderListInReport";
import PieChart from "./PieChart";
import styles from "./report.module.scss";
import StackChart from "./StackChart";
import TotalInfo from "./TotalInfo";

const ReportComp: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  const [startDate, setStartDate] = useState(dayjs().startOf("month").utc().format());
  const [endDate, setEndDate] = useState(dayjs().endOf("month").utc().format());
  // fetch data with param
  const [data, setData] = useState<ReportOrderList[]>([]);
  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    paginationMetadataStyle: "body",
    perPage: 10,
    page: 1,
    start_date: startDate,
    end_date: endDate,
  });
  const [metadata, setMetadata] = useState({
    "x-total-count": 0,
    "x-pages-count": 0,
  });
  // end

  const [totalInfo, setTotalInfo] = useState<TotalInfo>({} as TotalInfo);
  const [bestSellerData, setBestSellerData] = useState<BestSellerData[]>([]);
  const [activeTab, setActiveTab] = useState(SelectDate.WEEK.toString());
  const [dataChart, setDataChart] = useState([]);

  //

  const startWeekDefault = dayjs().startOf("week").utc().format();
  const endWeekDefault = dayjs().endOf("week").utc().format();
  const startMonthDefault = dayjs().startOf("month").utc().format();
  const endMonthDefault = dayjs().endOf("month").utc().format();
  const startYearDefault = dayjs().startOf("year").utc().format();
  const endYearDefault = dayjs().endOf("year").utc().format();

  const [startCurrentWeek, setStartCurrentWeek] = useState(startWeekDefault);
  const [endCurrentWeek, setEndCurrentWeek] = useState(endWeekDefault);
  const [startCurrentMonth, setStartCurrentMonth] = useState(startMonthDefault);
  const [endCurrentMonth, setEndCurrentMonth] = useState(endMonthDefault);
  const [startCurrentYear, setStartCurrentYear] = useState(startYearDefault);
  const [endCurrentYear, setEndCurrentYear] = useState(endYearDefault);

  const textDate = useMemo(() => {
    if (activeTab === SelectDate.WEEK.toString()) {
      const monthOfStart = dayjs(startCurrentWeek).startOf("M");
      const monthOfEnd = dayjs(endCurrentWeek).startOf("M");
      let isSame = monthOfStart.isSame(monthOfEnd);
      if (isSame) {
        return dayjs(startCurrentWeek).format("MMM YYYY");
      } else {
        return `${dayjs(startCurrentWeek).format("MMM")} - ${dayjs(endCurrentWeek).format("MMM YYYY")}`;
      }
    }
    if (activeTab === SelectDate.MONTH.toString()) {
      return dayjs(startCurrentMonth).format("MMM YYYY");
    }
    return dayjs(startCurrentYear).format("YYYY");
  }, [startCurrentWeek, endCurrentWeek, activeTab, startCurrentMonth, startCurrentYear]);

  const resetToToday = () => {
    setStartCurrentWeek(startWeekDefault);
    setEndCurrentWeek(endWeekDefault);
    setStartCurrentMonth(startMonthDefault);
    setEndCurrentMonth(endMonthDefault);
  };

  useEffect(() => {
    if (storeId) {
      getListOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, storeId, params]);

  useEffect(() => {
    if (storeId) {
      getTotalInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  useEffect(() => {
    if (storeId) {
      getBestSellerData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  useEffect(() => {
    if (storeId) {
      getChart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    storeId,
    activeTab,
    startCurrentWeek,
    endCurrentWeek,
    startCurrentMonth,
    endCurrentMonth,
    startCurrentYear,
    endCurrentYear,
  ]);

  const getChart = async () => {
    let params = {
      reportView: "weekly",
      start_date: startCurrentWeek,
      end_date: endCurrentWeek,
    };
    if (activeTab === SelectDate.MONTH.toString()) {
      params = {
        reportView: "monthly",
        start_date: startCurrentMonth,
        end_date: endCurrentMonth,
      };
    }
    if (activeTab === SelectDate.YEAR.toString()) {
      params = {
        reportView: "yearly",
        start_date: startCurrentYear,
        end_date: endCurrentYear,
      };
    }
    const res = await defaultAxios.get<any>(REPORT_CHART(storeId as string), {
      params,
    });

    setDataChart(res.data);
  };

  const getBestSellerData = async () => {
    const res = await defaultAxios.get<any>(REPORT_BEST_SELLER(storeId as string));
    setBestSellerData(res.data);
  };

  const getTotalInfo = async () => {
    const res = await defaultAxios.get<any>(REPORT_TOTAL_INFO(storeId as string));
    setTotalInfo(res.data);
  };

  const getListOrder = async () => {
    try {
      const orderList = await defaultAxios.get<any>(REPORT_ORDER_LIST(storeId as string), {
        params: params,
      });

      if (orderList?.data?.data) {
        console.log(orderList);
        setData(orderList?.data?.data);
        setMetadata(orderList.data.metadata);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    resetToToday();
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    setParams({
      ...params,
      page,
      perPage: pageSize,
    });
    setPage(page);
  };

  const renderTotalInfor = () => {
    return (
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <TotalInfo
            title="Total Order"
            amount={`${new BigNumber(totalInfo?.total_order).toFormat()}`}
            percent="4,6%"
            isIncrease
            image="/images/bell.svg"
          />
        </Col>
        <Col span={12}>
          <TotalInfo
            title="Total Revenue"
            amount={`S$ ${format2Digit(totalInfo?.total_revenue || 0)}`}
            percent="6%"
            isIncrease={false}
            lp={`${formatLP(totalInfo?.total_received_lp)}`}
            image="/images/dollar.svg"
            isFiat
          />
        </Col>
      </Row>
    );
  };

  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const exportData = (data: any, fileName: string, type: string) => {
    // Create a link and download the file
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportToCsv = async () => {
    try {
      const csvData = Papa.unparse(data);
      exportData(csvData, "data.csv", "text/csv;charset=utf-8;");
    } catch (error) {
      console.log({ error });
    }
  };

  const Tabs = [
    {
      title: "Week",
      key: SelectDate.WEEK.toString(),
    },

    {
      title: "Month",
      key: SelectDate.MONTH.toString(),
    },

    {
      title: "Year",
      key: SelectDate.YEAR.toString(),
    },
  ];

  const handleFilter = (start_date: string, end_date: string) => {
    setStartDate(start_date);
    setEndDate(end_date);
  };

  const handlePrev = () => {
    if (activeTab === SelectDate.WEEK.toString()) {
      const aWeekAgo = dayjs(startCurrentWeek).subtract(7, "days");
      setStartCurrentWeek(aWeekAgo.utc().format());
      setEndCurrentWeek(dayjs(startCurrentWeek).subtract(1, "m").utc().format());
      return;
    }
    if (activeTab === SelectDate.MONTH.toString()) {
      const aMonthAgo = dayjs(startCurrentMonth).subtract(1, "M");
      setStartCurrentMonth(aMonthAgo.utc().format());
      setEndCurrentMonth(aMonthAgo.endOf("M").utc().format());
      return;
    }
    const aYearAgo = dayjs(startCurrentYear).subtract(1, "y");
    setStartCurrentYear(aYearAgo.utc().format());
    setEndCurrentYear(aYearAgo.endOf("y").utc().format());
  };

  const handleNext = () => {
    if (activeTab === SelectDate.WEEK.toString()) {
      const nextWeek = dayjs(endCurrentWeek).add(7, "days");
      setStartCurrentWeek(dayjs(endCurrentWeek).add(1, "m").utc().format());
      setEndCurrentWeek(nextWeek.utc().format());
      return;
    }
    if (activeTab === SelectDate.MONTH.toString()) {
      const nextMonth = dayjs(startCurrentMonth).add(1, "M");
      setEndCurrentMonth(nextMonth.endOf("M").utc().format());
      setStartCurrentMonth(nextMonth.utc().format());
      return;
    }
    const nextYear = dayjs(startCurrentYear).add(1, "y");
    setStartCurrentYear(nextYear.utc().format());
    setEndCurrentYear(nextYear.endOf("y").utc().format());
  };

  const handleToday = () => {
    if (activeTab === SelectDate.WEEK.toString()) {
      setStartCurrentWeek(startWeekDefault);
      setEndCurrentWeek(endWeekDefault);
      return;
    }
    if (activeTab === SelectDate.MONTH.toString()) {
      setStartCurrentMonth(startMonthDefault);
      setEndCurrentMonth(endMonthDefault);
      return;
    }
    setStartCurrentYear(startYearDefault);
    setEndCurrentYear(endYearDefault);
  };

  return (
    <div className={styles.wrapper}>
      {renderTotalInfor()}
      <Row gutter={[16, 16]} style={{ height: "100%", alignItems: "stretch" }}>
        <Col span={16}>
          <div className={styles.chart}>
            <div className={styles.textAndTabs}>
              <div className={styles.title}>Revenue Report</div>
              <div className={styles.filter}>
                <Button className={styles.buttonToday} onClick={handleToday}>
                  Today
                </Button>
                <div className={styles.nextAndPrev}>
                  <LeftOutlined className={styles.colorIcon} onClick={handlePrev} style={{ marginRight: 10 }} />
                  <RightOutlined className={styles.colorIcon} onClick={handleNext} />
                </div>
                <div className={styles.colorIcon} style={{ fontWeight: 500, fontSize: 14, lineHeight: "20px" }}>
                  {textDate}
                </div>
              </div>
              <div>
                <CustomTabs
                  tabStyle={styles.customTab}
                  activeTab={activeTab}
                  onChange={handleTabChange}
                  tabs={Tabs}
                  children={undefined}
                ></CustomTabs>
              </div>
            </div>
            <StackChart dataChart={dataChart} activeKey={activeTab} />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.piechart}>
            <div className={styles.title}>Best Selling</div>
            {bestSellerData.length > 0 && <PieChart data={bestSellerData} />}
          </div>
        </Col>
      </Row>

      <div className={styles.orderList}>
        <OrderListInReport
          data={data}
          onFilter={handleFilter}
          onExportToCsv={handleExportToCsv}
          handleChangePagination={handleChangePagination}
          page={page}
          total={metadata["x-total-count"]}
        />
      </div>
    </div>
  );
};

export default ReportComp;
