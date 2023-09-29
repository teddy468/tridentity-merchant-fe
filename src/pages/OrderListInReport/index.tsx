import OrderListInReportComp from "../../components/OrderListInReportComp";

interface IOrderListInReport {
  data: ReportOrderList[];
  onFilter: (start_date: string, end_date: string) => void;
  onExportToCsv: () => void;
  page: number;
  total: number;
  handleChangePagination: (pageNumber: number, pageSize: number) => void;
}

const OrderListInReport: React.FC<IOrderListInReport> = (props: IOrderListInReport) => {
  const { data, onFilter, onExportToCsv, page, total, handleChangePagination } = props;

  return (
    <OrderListInReportComp
      data={data}
      onFilter={onFilter}
      onExportToCsv={onExportToCsv}
      page={page}
      total={total}
      handleChangePagination={handleChangePagination}
    />
  );
};

export default OrderListInReport;
