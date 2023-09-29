import "./custom-table.scss";
import { Table, TableProps } from "antd";

interface CustomTableProps extends TableProps<any> {
  className?: string;
}

const CustomTable = ({ className, scroll = { y: "28vw" }, ...props }: CustomTableProps) => {
  return <Table {...props} className={["custom-table", className].join(" ")} scroll={scroll} />;
};

export default CustomTable;
