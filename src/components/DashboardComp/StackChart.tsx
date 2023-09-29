import { Column } from "@ant-design/plots";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { SelectDate } from "../../commons/constants/product";

export const nFormatter = (number: string, digits = 4, roundingMode?: BigNumber.RoundingMode) => {
  const SI = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const num = parseFloat(number);
  let i;
  for (i = SI.length - 1; i > 0; i--) {
    if (num >= SI[i].value) {
      break;
    }
  }
  if (roundingMode) {
    return (
      new BigNumber(num).div(SI[i].value).toFixed(digits, roundingMode).toString().replace(rx, "$1") + SI[i].symbol
    );
  }

  return (num / SI[i].value).toFixed(digits).replace(rx, "$1") + SI[i].symbol;
};

const StackChart = (props: any) => {
  const { dataChart, activeKey } = props;
  const result = useMemo(() => {
    let revenueArr = dataChart.map((item: any) => {
      return {
        x_axis: item.x_axis,
        value: item.revenue - item.profit,
        type: "Revenue",
        originValue: item.revenue,
      };
    });

    // let profitArr = dataChart.map((item: any) => {
    //   return {
    //     x_axis: item.x_axis,
    //     value: item.profit,
    //     originValue: item.profit, temporary comment
    //     type: "Profit",
    //   };
    // });
    // return revenueArr.concat(profitArr);
    return revenueArr;
  }, [dataChart]);

  let greenColor = "#469175";
  let yellowColor = "#F4E85B";

  const handleLable = (lable: string) => {
    const splitText = lable.split(` `);
    const nameDay = splitText[0];
    const fullDate = splitText[1];
    const dayNumber = fullDate.split("/")[0];
    const monthNumber = fullDate.split("/")[1];
    if (activeKey === SelectDate.WEEK.toString()) {
      return `${nameDay} ${dayNumber}`;
    }
    if (activeKey === SelectDate.MONTH.toString()) {
      return `${dayNumber}/${monthNumber}`;
    }
    return nameDay;
  };

  const config: any = {
    data: result,
    isStack: true,
    xField: "x_axis",
    yField: "value",
    seriesField: "type",
    colorField: "type", // or seriesField in some cases
    color: [greenColor, yellowColor],
    domStyles: {
      "g2-tooltip": {
        background: "linear-gradient(324deg, #0B0B0B 38.44%, #161A18 85.8%)",
        // boxShadow: userTheme === THEME_MODE.DARK ? 'none' : undefined,
        opacity: 1,
        borderRadius: "16px",
      },
      "g2-tooltip-title": {
        color: "#FFFFFF;",
        fontWeight: "400",
        fontSize: "14px",
      },
      "g2-tooltip-list-item": {
        color: "#FFFFFF",
        fontSize: "12px",
        marginTop: "-4px",
      },
      "g2-tooltip-marker": {
        display: "none",
      },
    },
    legend: {
      layout: "horizontal",
      position: "top-right",
    },
    smooth: true,
    label: {
      position: "middle",
      content: "",
    },
    xAxis: {
      label: {
        formatter: (text: string, item: any, index: number) => {
          return handleLable(text);
        },
        style: {
          fill: "#FFFFFF",
          fontWeight: 600,
          fontSize: 12,
        },
      },
    },
    tooltip: {
      domStyles: {
        "g2-tooltip": {
          boxShadow: "0px 0px 5px 0px yellow,0px 0px 10px 2px",
          backgroundColor: "black",
        },
        "g2-tooltip-title": {
          color: "white",
        },
        "g2-tooltip-name": {
          color: "white",
        },
        "g2-tooltip-value": {
          color: "white",
          fontWeight: 600,
        },
      },
      fields: ["x_axis", "value", "type", "originValue"],
      formatter: (datum: any) => {
        if (datum?.originValue === datum?.value) {
          return {
            name: datum.type,
            value: `S$ ${nFormatter(datum?.value, 2)}`,
          };
        }
        return {
          name: datum.type,
          value: `S$ ${nFormatter(datum.originValue, 2)}`,
        };
      },
    },
  };

  return <Column {...config} />;
};

export default StackChart;
