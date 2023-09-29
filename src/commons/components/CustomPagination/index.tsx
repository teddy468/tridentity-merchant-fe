import { Pagination, PaginationProps } from "antd";
import "./custom-pagination.scss";

interface CustomPaginationProps extends PaginationProps {}
const CustomPagination: React.FC<CustomPaginationProps> = props => {
  return <Pagination className={"custom-pagination"} {...props} />;
};

export default CustomPagination;
