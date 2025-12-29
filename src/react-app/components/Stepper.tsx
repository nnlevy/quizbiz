type StepperProps = {
  steps: string[];
  activeIndex: number;
};

const Stepper = ({ steps, activeIndex }: StepperProps) => (
  <ol className="stepper" aria-live="polite">
    {steps.map((step, index) => (
      <li key={step} className={index <= activeIndex ? "active" : ""}>
        {step}
      </li>
    ))}
  </ol>
);

export default Stepper;
