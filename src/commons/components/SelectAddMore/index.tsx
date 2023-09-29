import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Form, FormItemProps, Input, InputRef, Select, SelectProps, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

interface ISelectAddMore extends SelectProps {
  name: string;
  label?: React.ReactNode;
  rules?: FormItemProps["rules"];
  selectClassName?: string;
  prefixIcon?: React.ReactNode;
  product: any;
}
const SelectAddMore: React.FC<ISelectAddMore> = (props: ISelectAddMore) => {
  const { rules, label, className, name, selectClassName, prefixIcon, product, ...selectProps } = props;

  const [newHashtag, setNewHashTag] = useState("");
  const inputRef = useRef<InputRef>(null);
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (product && product.sub_tags && product.sub_tags.length > 0) {
      setItems(product?.sub_tags);
    }
  }, [product?.sub_tags , product]);

  let index = 0;

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHashTag(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setItems([...items, newHashtag || `New item ${index++}`]);
    setNewHashTag("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  return (
    <Form.Item className={`${styles.wrapper} ${className ?? ""}`}>
      {prefixIcon && <div className={styles["prefix-icon-wrapper"]}>{prefixIcon}</div>}
      <Form.Item
        name={name}
        className={`${styles.group} ${label ? styles.label : ""}`}
        label={label}
        rules={rules}
        labelCol={{ span: 24 }}
      >
        <Select
          className={`${styles.customInput} ${prefixIcon && styles.customIcon} ${selectClassName ?? ""}`}
          placeholder=""
          {...selectProps}
          dropdownRender={menu => {
            return (
              <>
                {menu}
                <Divider
                  style={{
                    margin: "8px 0",
                  }}
                />
                <Space
                  style={{
                    padding: "0 8px 4px",
                  }}
                >
                  <Input
                    placeholder="Please enter item"
                    ref={inputRef}
                    value={newHashtag}
                    onChange={onNameChange}
                    onKeyDown={e => e.stopPropagation()}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Add item
                  </Button>
                </Space>
              </>
            );
          }}
          options={items.map(item => ({
            label: item,
            value: item,
          }))}
        />
      </Form.Item>
    </Form.Item>
  );
};

export default SelectAddMore;
