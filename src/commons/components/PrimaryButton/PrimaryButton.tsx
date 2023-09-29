import styles from "./PrimaryButton.module.scss";

interface PrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
const PrimaryButton = ({ children, className, onClick, ...props }: PrimaryProps) => {
  return (
    <button className={[styles.primaryButton, className].join(" ")} {...props} onClick={onClick}>
      {children}
    </button>
  );
};

export default PrimaryButton;
