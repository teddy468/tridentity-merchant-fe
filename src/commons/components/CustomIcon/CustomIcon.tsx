import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import styles from "./CustomIcon.module.scss";

interface DefaultProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Import default from svg, eg: import { ReactComponent as ProfileIcon } from "./profile.svg";
   */
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  /**
   * @requires width if not set height;
   */
  width?: number;
  /**
   * @requires height if not set width;
   */
  height?: number;
  /**
   * If not set originHeight, icon will invisible when first load;
   */
  originWidth?: number;
  /**
   * If not set originHeight, icon will invisible when first load;
   */
  originHeight?: number;
  /**
   * Apply color for fill of path. If fill = undefiend, fill color is svg origin color
   */
  fill?: "currentColor" | "gradient" | string;
  /**
   * Apply color for stroke of path. If stroke = undefiend, stroke color is svg origin color
   */
  stroke?: "currentColor" | "gradient" | string;

  color?: string;

  disabled?: boolean;
}

type Props = DefaultProps & Required<{ width: number } | { height: number }>;

const CustomIcon: React.FC<Props> = React.forwardRef((props: Props, boxRef) => {
  const {
    id,
    icon: Icon,
    width,
    height,
    originWidth,
    originHeight,
    fill,
    stroke,
    color,
    disabled = false,
    ...otherProps
  } = props;
  const ref = useRef<SVGSVGElement | null>(null);
  const [svgWidth, setSvgWidth] = useState<number | undefined>(originWidth);
  const [svgHeight, setSvgWheight] = useState<number | undefined>(originHeight);
  const [mounted, setMounted] = useState<boolean>(!!originWidth && !!originHeight);

  useEffect(() => {
    if (ref.current) {
      setSvgWidth(ref.current?.width?.baseVal?.value);
      setSvgWheight(ref.current?.height?.baseVal?.value);
      setMounted(true);
    }
  }, []);
  const scaleX = svgWidth && (width || 0) / svgWidth;
  const scaleY = svgHeight && (height || 0) / svgHeight;

  const gradientId = `gradient-${id ?? 0}`;
  return (
    <div
      className={styles.box}
      style={{
        width: width || height,
        height: height || width,
        visibility: mounted ? "visible" : "hidden",
        color: color || (fill === "gradient" || stroke === "gradient" ? `url(#${gradientId})` : fill || stroke),
      }}
      {...otherProps}
    >
      {(fill === "gradient" || stroke === "gradient") && (
        <svg width={0} height={0}>
          <linearGradient id={gradientId} gradientTransform="rotate(94.22)">
            <stop id="stop1" offset="0%" stopColor="#FDCD9D" stopOpacity="0.5" />
            <stop id="stop2" offset="100%" stopColor="#F7EF82" />
          </linearGradient>
        </svg>
      )}
      <Icon
        ref={ref}
        className={`${styles.icon} ${disabled ? styles.noDrop : ""} ${
          fill ? styles.fill : stroke ? styles.stroke : ""
        }`}
        style={{
          transform: scaleX || scaleY ? `scale(${scaleX || scaleY},${scaleY || scaleX})` : "none",
          color:
            fill === "gradient"
              ? `url(#${gradientId})`
              : fill
              ? fill
              : stroke === "gradient"
              ? `url(#${gradientId})`
              : stroke,
        }}
      />
    </div>
  );
});

export default CustomIcon;
