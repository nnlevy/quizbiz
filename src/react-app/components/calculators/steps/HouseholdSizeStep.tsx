import type { ChangeEvent } from "react";

const HouseholdSizeStep = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (nextValue: number) => void;
}) => (
  <label className="ws-calculators__label">
    <span>Household size</span>
    <input
      className="ws-calculators__input"
      type="number"
      min={1}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(Number(event.target.value))
      }
    />
  </label>
);

export default HouseholdSizeStep;
