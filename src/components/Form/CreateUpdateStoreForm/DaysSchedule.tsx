import { Checkbox, Col, FormInstance } from "antd";
import React, { useEffect } from "react";
import styles from "./CreateUpdateStoreForm.module.scss";
import TimeInput from "../../../commons/components/TimeInput/TimeInput";

interface DayScheduleProps {
  form: FormInstance;
  Form: any;
  item: { openName: string; closeName: string; title: string };
  isUpdatingStore: boolean;
}

const DaysSchedule: React.FC<DayScheduleProps> = ({ form, item, isUpdatingStore }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  useEffect(() => {
    if (isUpdatingStore) {
      !form.getFieldValue(item.openName) && setIsOpen(false);
    }
  }, [isUpdatingStore]);
  useEffect(() => {
    if (!isOpen) {
      // reset error for open time
      form.setFields([
        {
          name: item.openName,
          errors: [],
          value: null,
        },
      ]);
      // reset error for close time
      form.setFields([
        {
          name: item.closeName,
          errors: [],
          value: null,
        },
      ]);
    }
  }, [isOpen]);
  return (
    <>
      <Col xs={24} sm={2}>
        <p className={styles.title}>{item.title}</p>
      </Col>

      {isOpen && (
        <>
          <Col xs={24} sm={8}>
            <TimeInput
              label={""}
              name={item.openName}
              format={"HH:mm"}
              rules={[
                {
                  required: true,
                  message: "Please input open time",
                },
              ]}
            />
          </Col>
          <Col xs={24} sm={8}>
            <TimeInput
              name={item.closeName}
              label=""
              format={"HH:mm"}
              rules={[
                {
                  required: true,
                  message: "Please input close time",
                },
              ]}
            />
          </Col>
        </>
      )}
      <Col xs={24} sm={4}>
        <div style={{ display: "flex", gap: "5px" }}>
          <p>OFF</p>
          <Checkbox
            className={styles.checkBox}
            checked={!isOpen}
            onChange={e => {
              setIsOpen(!e.target.checked);
            }}
          />
        </div>
      </Col>
    </>
  );
};

export default DaysSchedule;
