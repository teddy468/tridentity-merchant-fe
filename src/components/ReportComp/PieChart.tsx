import { Pie, PieConfig } from "@ant-design/plots";
import _ from "lodash";
import React, { useMemo } from "react";
import { nFormatter } from "./StackChart";
interface IPieChart {
  data: BestSellerData[];
}
const PieChart: React.FC<IPieChart> = (props: IPieChart) => {
  const { data } = props;
  const result = useMemo(() => {
    const rs = data.map(item => {
      return {
        type: item.name,
        value: item.revenue,
      };
    });

    const order = _.orderBy(rs, "value", "desc");
    const threeOrder = order.slice(0, 3);
    const other = _.drop(order, 3);
    if (other.length > 0) {
      let totalBalance: any = 0;
      totalBalance = other?.reduce((total: any, item: any) => total + item?.value, totalBalance);
      const otherObj = {
        type: "Other",
        value: totalBalance,
      };
      threeOrder.push(otherObj);
      return threeOrder;
    } else {
      return order;
    }
  }, [data]);

  const config: PieConfig = {
    custom: true,
    appendPadding: 10,
    data: result,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.8,
    label: {
      type: "inner",
      offset: "-50%",
      content: "",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    pieStyle: {
      lineWidth: 0,
    },
    legend: {
      layout: "vertical",
      position: "bottom",
      itemHeight: 12,
      maxRow: 10,
    },
    smooth: true,
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
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
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `S$ ${nFormatter(datum.value, 2)}`,
        };
      },
    },

    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "",
      },
    },
  } as any;
  return <Pie {...config} />;
};

export default React.memo(PieChart);
