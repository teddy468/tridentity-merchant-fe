import styles from "./custom-tabs.module.scss";
import Tab from "./Tab";

interface CustomTabsProps {
  tabs: {
    title: string;
    children?: React.ReactNode;
    key: string;
  }[];
  activeTab: string;
  onChange: (key: string) => void;
  className?: string;
  children: React.ReactNode;
  tabStyle?: string;
  width?: string;
}

const CustomTabs = ({ tabs, activeTab, onChange, children, className, tabStyle, width }: CustomTabsProps) => {
  return (
    <div className={styles.customTabs}>
      <div className={[styles.wrapper, className].join(" ")} style={width ? { width: width } : undefined}>
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <Tab
              style={{ width: `${100 / tabs.length}%` }}
              onClick={() => onChange(tab.key)}
              key={tab.key}
              active={activeTab === tab.key}
              title={tab.title}
              children={tab.children}
              className={tabStyle}
            />
          ))}
        </div>
      </div>
      {children}
    </div>
  );
};

export default CustomTabs;
