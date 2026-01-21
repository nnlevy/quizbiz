import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
};

const buttonClass = (variant: Variant, className?: string) =>
  `${variant === "secondary" ? "ws-button-secondary" : "ws-button"}${className ? ` ${className}` : ""}`;

export const ActionButton = ({ variant = "primary", className, ...props }: ActionButtonProps) => (
  <button {...props} className={buttonClass(variant, className)} />
);

export const ActionLink = ({ variant = "primary", className, ...props }: ActionLinkProps) => (
  <a {...props} className={buttonClass(variant, className)} />
);

