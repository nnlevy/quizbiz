import { type InputHTMLAttributes } from "react";
import "./Input.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Input = ({ className, ...props }: InputProps) => (
  <input {...props} className={`ws-ui-input${className ? ` ${className}` : ""}`} />
);

export default Input;
