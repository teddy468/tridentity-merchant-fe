import styles from "./badge-card.module.scss";

interface BadgeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  storeName: string;
  image: string;
  className?: string;
  onClick: () => void;
}
const BadgeCard: React.FC<BadgeCardProps> = ({ storeName, image, className, onClick, ...props }: BadgeCardProps) => {
  return (
    <div className={[styles.wrapper, className].join(" ")} {...props} onClick={onClick}>
      <div className={styles.wrappStore}>
        <div
          style={{
            backgroundImage: `url(/images/Badge.png)`,
            width: 136,
            height: 136,
            backgroundRepeat: "no-repeat",
            marginTop: 20,
            position: "relative",
          }}
        >
          <img src={image} alt="icon" className={styles.image} />
        </div>
      </div>
      <div className={styles.name}>{storeName}</div>
    </div>
  );
};

export default BadgeCard;
