import { ImgHTMLAttributes } from "react";

type SizeProps =
  | { width: number; height: number; aspectRatio?: never }
  | { aspectRatio: number | string; width?: number; height?: number };

type WsImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "loading" | "decoding" | "width" | "height"> &
  SizeProps & {
    eager?: boolean;
  };

const WsImage = ({ eager = false, style, aspectRatio, width, height, ...rest }: WsImageProps) => {
  const loading = eager ? "eager" : "lazy";
  const fetchPriority = rest.fetchPriority ?? (eager ? "high" : undefined);
  const resolvedStyle = aspectRatio
    ? { ...style, aspectRatio: typeof aspectRatio === "number" ? `${aspectRatio}` : aspectRatio }
    : style;

  return (
    <img
      {...rest}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      style={resolvedStyle}
    />
  );
};

export default WsImage;
