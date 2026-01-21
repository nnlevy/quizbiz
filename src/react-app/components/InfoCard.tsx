import type { HTMLAttributes } from "react";
import { ElementType, ReactNode } from "react";

type CardVariant = "info" | "cta";

type InfoCardProps = {
  as?: ElementType;
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

const InfoCard = ({
  as: Component = "div",
  variant = "info",
  className,
  children,
  ...rest
}: InfoCardProps) => {
  const baseClass = variant === "cta" ? "ws-cta-card" : "ws-info-card";
  const classes = className ? `${baseClass} ${className}` : baseClass;
  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

export default InfoCard;
