const HouseholdSizeStep = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <label className="ws-calculators__label">
    <span>Household size</span>
    <input
      className="ws-calculators__input"
      type="number"
      min={1}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
);

export default HouseholdSizeStep;
