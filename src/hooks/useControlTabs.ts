import React from "react";

const useControlTabs = (defaultActiveTab: string) => {
  const [activeTab, setActiveTab] = React.useState(defaultActiveTab);
  const onChange = (key: string) => {
    setActiveTab(key);
  };

  return { onChange, activeTab };
};

export default useControlTabs;
