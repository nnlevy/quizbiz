const FlowRateStep = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <label className="ws-calculators__label">
    <span>Flow rate (GPM)</span>
    <input
      className="ws-calculators__input"
      type="number"
      step={0.1}
      min={1}
      max={5}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
);

export default FlowRateStep;
