import { InputProps } from "antd";
import { useEffect, useState } from "react";
import CustomInput from "../CustomInput/CustomInput";
import CustomIcon from "../CustomIcon/CustomIcon";
import { SearchNormalIcon } from "../../resources";

interface SearchInputProps extends InputProps {
  onSearch: (value: string) => void;
  delay?: number;
}

export const SearchInput = (props: SearchInputProps) => {
  const [value, setValue] = useState<string>(props.value?.toString() || "");
  const { onSearch, delay = 500, allowClear = true, placeholder = "Tìm kiếm", onChange, ...inputProps } = props;
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, onSearch, delay]);

  return (
    <CustomInput
      {...inputProps}
      allowClear={allowClear}
      placeholder={placeholder}
      onChange={e => {
        setValue(e.target.value);
        onChange?.(e);
      }}
      prefix={<CustomIcon icon={SearchNormalIcon} width={20} stroke="currentColor" />}
    />
  );
};
