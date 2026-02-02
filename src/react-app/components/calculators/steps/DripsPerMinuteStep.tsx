const DripsPerMinuteStep = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <label className="ws-calculators__label">
    <span>Drips per minute</span>
    <input
      className="ws-calculators__range"
      type="range"
      min={0}
      max={180}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
    <span className="ws-calculators__range-value">{value} drips/min</span>
  </label>
);

export default DripsPerMinuteStep;
