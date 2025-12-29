import type { ReactNode } from "react";

type InlineHelpAccordionProps = {
  label: string;
  children: ReactNode;
};

const InlineHelpAccordion = ({ label, children }: InlineHelpAccordionProps) => (
  <details className="inline-help">
    <summary>{label}</summary>
    <div className="inline-help__content">{children}</div>
  </details>
);

export default InlineHelpAccordion;
