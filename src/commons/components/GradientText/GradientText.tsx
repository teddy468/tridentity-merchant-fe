import styles from "./GradientText.module.scss";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string | React.ReactNode;
  className?: string;
}
const GradientText = ({ text, className, ...props }: GradientTextProps) => {
  return (
    <span {...props} className={[styles.gradientText, className].join(" ")} {...props}>
      {text}
    </span>
  );
};

export default GradientText;
