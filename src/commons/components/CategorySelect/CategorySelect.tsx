import { FormItemProps, SelectProps } from "antd";
import { BaseOptionType } from "antd/es/select";
import { useContext } from "react";
import { AppContext } from "../../../contexts/AppContext";
import { CustomSelect } from "../CustomSelect/CustomSelect";

interface Props extends SelectProps {
  name: string;
  label?: React.ReactNode;
  rules?: FormItemProps["rules"];
  selectClassName?: string;
}

export const CategorySelect = (props: Props) => {
  const { categories } = useContext(AppContext);

  return (
    <CustomSelect
      {...props}
      options={categories.map(({ id: value, name: label }) => ({ value: value.toString(), label }))}
    />
  );
};
