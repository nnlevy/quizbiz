import { type ButtonHTMLAttributes } from "react";
import "./Button.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

const Button = ({ className, ...props }: ButtonProps) => (
  <button {...props} className={`ws-ui-button${className ? ` ${className}` : ""}`} />
);

export default Button;
