const BillAmountStep = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <label className="ws-calculators__label">
    <span>Current bill amount</span>
    <input
      className="ws-calculators__input"
      type="number"
      min={0}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
);

export default BillAmountStep;
