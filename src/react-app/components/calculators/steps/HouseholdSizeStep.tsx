import type { ChangeEvent } from "react";

const HouseholdSizeStep = ({
  value,
  onChange,
  isCommercial = false,
}: {
  value: number;
  onChange: (nextValue: number) => void;
  isCommercial?: boolean;
}) => (
  <label className="ws-calculators__label">
    <span>{isCommercial ? "Average daily staff or occupants" : "Household size"}</span>
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
