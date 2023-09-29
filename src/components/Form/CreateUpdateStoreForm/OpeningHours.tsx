import { FormInstance } from "antd";
import React from "react";
import DaysSchedule from "./DaysSchedule";

interface OpeningHoursProps {
  Form: any;
  form: FormInstance;
  isUpdatingStore: boolean;
}
const OpeningHours: React.FC<OpeningHoursProps> = ({ form, Form, isUpdatingStore }) => {
  const OpeningHoursForm = [
    {
      title: "Monday",
      openName: "openingHoursMon",
      closeName: "closingHoursMon",
      offName: "offMon",
      type: "time",
    },
    {
      title: "Tuesday",
      openName: "openingHoursTue",
      closeName: "closingHoursTue",
      offName: "offTue",
      type: "time",
    },
    {
      title: "Wednesday",
      openName: "openingHoursWed",
      closeName: "closingHoursWed",
      offName: "offWed",
      type: "time",
    },
    {
      title: "Thursday",
      openName: "openingHoursThu",
      closeName: "closingHoursThu",
      offName: "offThu",
      type: "time",
    },
    {
      title: "Friday",
      openName: "openingHoursFri",
      closeName: "closingHoursFri",
      offName: "offFri",
      type: "time",
    },
    {
      title: "Saturday",
      openName: "openingHoursSat",
      closeName: "closingHoursSat",
      offName: "offSat",
      type: "time",
    },
    {
      title: "Sunday",
      openName: "openingHoursSun",
      closeName: "closingHoursSun",
      offName: "offSun",
      type: "time",
    },
  ];

  return (
    <>
      {OpeningHoursForm.map(item => {
        return (
          <div key={item.title} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <DaysSchedule form={form} Form={Form} item={item} isUpdatingStore={isUpdatingStore} />
          </div>
        );
      })}
    </>
  );
};

export default OpeningHours;
