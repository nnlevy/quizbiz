const ShowerDurationStep = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <label className="ws-calculators__label">
    <span>Shower duration</span>
    <input
      className="ws-calculators__range"
      type="range"
      min={2}
      max={30}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
    <span className="ws-calculators__range-value">{value} minutes</span>
  </label>
);

export default ShowerDurationStep;
