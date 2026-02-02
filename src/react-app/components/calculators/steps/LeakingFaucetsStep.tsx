const LeakingFaucetsStep = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <label className="ws-calculators__label">
    <span>Leaking faucets</span>
    <input
      className="ws-calculators__input"
      type="number"
      min={1}
      max={50}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
);

export default LeakingFaucetsStep;
