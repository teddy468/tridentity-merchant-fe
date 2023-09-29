import styles from "./tab.module.scss";

interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}
const Tab: React.FC<TabProps> = ({ title, children, active, className, ...props }: TabProps) => {
  return (
    <div className={[styles.tabWrapper, className, active && styles.activeTab].join(" ")} {...props}>
      <div className={styles.tab}>
        <div className={styles.tabTitle}>
          {title} {children}
        </div>
      </div>
    </div>
  );
};
export default Tab;
