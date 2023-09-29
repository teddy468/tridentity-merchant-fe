import { CSSProperties, FC } from "react";
import { PictureOutlined } from "@ant-design/icons";
import { getThumbnail } from "../utils/functions/getImage";

interface ImageProps {
  width?: number;
  height?: number;
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  placeholder?: FC;
  round?: false | number;
}

export const Image: FC<ImageProps> = props => {
  const { width, height, alt, src, className, style, placeholder: Icon = PictureOutlined, round = 8 } = props;
  if (!src) {
    return (
      <Icon className={className} size={width || 100} style={{ borderRadius: !round ? 0 : round, fontSize: width }} />
    );
  }
  return (
    <img
      className={className}
      src={getThumbnail(src, width, height)}
      style={{
        width: width || 100,
        height: height || 100,
        borderRadius: !round ? 0 : round,
        ...(style || {}),
      }}
      alt={alt || "nail tutorial"}
    />
  );
};
