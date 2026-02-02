import type { ChangeEvent } from "react";

const LeakDripsStep = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (nextValue: number) => void;
}) => (
  <label className="ws-calculators__label">
    <span>Drips per minute</span>
    <input
      className="ws-calculators__range"
      type="range"
      min={0}
      max={180}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(Number(event.target.value))
      }
    />
    <span className="ws-calculators__range-value">{value} drips/min</span>
  </label>
);

export default LeakDripsStep;
