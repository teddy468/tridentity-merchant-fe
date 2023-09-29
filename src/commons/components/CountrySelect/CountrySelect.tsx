import { FormItemProps, SelectProps } from "antd";
import { countries } from "../../constants/countries";
import { CustomSelect } from "../CustomSelect/CustomSelect";
interface Props extends SelectProps {
  name: string;
  label?: React.ReactNode;
  rules?: FormItemProps["rules"];
  selectClassName?: string;
}
export const CountrySelect = (props: Props) => {
  return <CustomSelect {...props} options={countries.map(({ code: value, name: label }) => ({ value, label }))} />;
};
