import { type InputHTMLAttributes } from "react";
import "./Slider.css";

type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  className?: string;
};

const Slider = ({ className, ...props }: SliderProps) => (
  <input {...props} type="range" className={`ws-ui-slider${className ? ` ${className}` : ""}`} />
);

export default Slider;
