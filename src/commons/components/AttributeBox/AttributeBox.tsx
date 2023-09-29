import React, { useState } from "react";
import styles from "./AttributeBox.module.scss";
import { Button, Col, Form, Row } from "antd";
import CustomIcon from "../CustomIcon/CustomIcon";
import { ArrowDownIcon, ArrowUpIcon, GradientPlusIcon, TrashIcon } from "../../resources";
import CustomInput from "../CustomInput/CustomInput";
import GradientText from "../GradientText/GradientText";
import { DEFAULT_PRODUCT_QUANTITY, TYPE_OF_ATTRIBUTES_OPTIONS } from "../../constants/product";
import { LETTER_REGEX_ALLOW_DECIMAL } from "../../constants";
import { NamePath } from "antd/es/form/interface";
import { isPositiveNumber } from "../../utils/functions/validation";
import RadioBoxList from "../RadioBoxList/RadioBoxList";

type Props = {
  attributeIndex: number;
  remove: (attributeIndex: number | number[]) => void;
  restAttribute: {
    fieldKey?: number | undefined;
  };
  disabled?: boolean;
};

const AttributeBox: React.FC<Props> = ({ attributeIndex, remove, restAttribute, disabled = false }) => {
  const [open, setOpen] = useState(true);
  const handleOnChangeInputNumber =
    (name: string, setFieldValue: (name: NamePath, value: any) => void, variantIndex: number) => (event: any) => {
      setFieldValue(
        ["attributes", attributeIndex, "variants", variantIndex, name],
        event.target.value.replace(LETTER_REGEX_ALLOW_DECIMAL, "")
      );
    };

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <Row gutter={32} style={{ width: "100%" }}>
          <Col lg={12} span={24}>
            <CustomInput
              disabled={disabled}
              label="Attribute name"
              name={[attributeIndex, "attribute_name"]}
              restField={restAttribute}
              placeholder="Attribute name"
              maxLength={20}
              rules={[
                {
                  required: true,
                  message: "This field is required",
                  whitespace: true,
                },
              ]}
            />
          </Col>
          <Col lg={12} span={24}>
            <Form.Item dependencies={[["attributes", attributeIndex, "type_of_attribute"]]}>
              {({ setFieldValue }) => {
                return (
                  <>
                    <RadioBoxList
                      disabled={disabled}
                      name={[attributeIndex, "type_of_attribute"]}
                      label="Type of attribute"
                      options={TYPE_OF_ATTRIBUTES_OPTIONS}
                      groupProps={{ labelCol: { span: 24 } }}
                      className={styles.checkboxWrapper}
                      rules={[{ required: true, message: "This field is required" }]}
                      onChange={e => {
                        setFieldValue(["attributes", attributeIndex, "type_of_attribute"], e.target.value);
                        setFieldValue(["attributes", attributeIndex, e.target.value as string], true);
                        const oldValue = TYPE_OF_ATTRIBUTES_OPTIONS.filter(item => item.value !== e.target.value);
                        setFieldValue(["attributes", attributeIndex, oldValue[0].value as string], false);
                      }}
                    />
                  </>
                );
              }}
            </Form.Item>
          </Col>
        </Row>
        <div className={styles.action}>
          <div className={styles.delete} onClick={() => remove(attributeIndex)}>
            <CustomIcon icon={TrashIcon} width={20} stroke="currentColor" />
          </div>
          <div className={styles.collaspe} onClick={() => setOpen(!open)}>
            <CustomIcon icon={open ? ArrowUpIcon : ArrowDownIcon} width={20} fill="currentColor" />
          </div>
        </div>
      </div>
      <div className={`${styles.content} ${open ? styles.open : ""}`}>
        <div className={styles.contentTitle}>Variation list</div>
        <Row className={styles.variationsHeader} gutter={32}>
          <Col span={12}>Variant Name *</Col>
          <Col span={12}>Price *</Col>
          {/* <Col span={7}>Stock Quantity *</Col> */}
          {/* <Col span={2}></Col> */}
        </Row>
        <Form.Item dependencies={[["attributes", attributeIndex, "variants"]]} noStyle>
          {({ getFieldValue, setFieldValue }) => (
            <Form.List name={[attributeIndex, "variants"]} {...restAttribute}>
              {(variants, { add, remove }) => (
                <>
                  {variants.map(({ key, name: variantIndex, ...restField }) => {
                    if (getFieldValue(["attributes", attributeIndex, "variants", variantIndex, "is_deleted"]))
                      return null;
                    return (
                      <Row key={key} className={styles.variations} gutter={[32, 0]}>
                        <Col span={11}>
                          <CustomInput
                            disabled={disabled}
                            inputClassName={styles.input}
                            name={[variantIndex, "attribute_value"]}
                            restField={restField}
                            placeholder="Variation name"
                            maxLength={20}
                            rules={[{ required: true, message: "This field is required", whitespace: true }]}
                          />
                        </Col>
                        <Col span={11}>
                          <CustomInput
                            disabled={disabled}
                            inputClassName={styles.input}
                            prefix="$"
                            name={[variantIndex, "price"]}
                            placeholder="Price"
                            maxLength={20}
                            rules={[
                              { required: true, message: "This field is required" },
                              { validator: isPositiveNumber("price") },
                            ]}
                            onChange={handleOnChangeInputNumber("price", setFieldValue, variantIndex)}
                          />
                        </Col>

                        <Col span={2}>
                          {variants.length > 1 && (
                            <div
                              className={styles.delete}
                              onClick={() => {
                                if (getFieldValue(["attributes", attributeIndex, "variants", variantIndex, "id"]))
                                  return setFieldValue(
                                    ["attributes", attributeIndex, "variants", variantIndex, "is_deleted"],
                                    true
                                  );
                                remove(variantIndex);
                              }}
                            >
                              <CustomIcon icon={TrashIcon} width={20} stroke="currentColor" />
                            </div>
                          )}
                        </Col>
                      </Row>
                    );
                  })}
                  <Button
                    className={styles.add}
                    onClick={() =>
                      add({
                        attribute_value: "",
                        price: "",
                        total_quantity: DEFAULT_PRODUCT_QUANTITY,
                      })
                    }
                    type="text"
                    disabled={disabled}
                  >
                    <CustomIcon icon={GradientPlusIcon} width={20} />
                    <GradientText text="Add variation" />
                  </Button>
                </>
              )}
            </Form.List>
          )}
        </Form.Item>
      </div>
    </div>
  );
};

export default AttributeBox;
