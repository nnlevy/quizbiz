import type { ChangeEvent } from "react";

const LeakFaucetsStep = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (nextValue: number) => void;
}) => (
  <label className="ws-calculators__label">
    <span>Leaking faucets</span>
    <input
      className="ws-calculators__input"
      type="number"
      min={1}
      max={50}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(Number(event.target.value))
      }
    />
  </label>
);

export default LeakFaucetsStep;
