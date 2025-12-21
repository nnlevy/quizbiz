import { ReactNode } from "react";

export type UtilityPayload = {
  departmentName: string;
  billPaymentUrl: string | null;
  phoneNumber: string | null;
  departmentWebsiteUrl: string | null;
  oversightDepartment: string | null;
  oversightUrl: string | null;
  grantsOrAidUrl: string | null;
  summaryLines: string[];
};

type UtilityResultCardProps = {
  utility: UtilityPayload;
  cta?: ReactNode;
};

const UtilityResultCard = ({ utility, cta }: UtilityResultCardProps) => {
  return (
    <article className="utility-result-card" aria-label={`Utility info for ${utility.departmentName}`}>
      <header>
        <h3>{utility.departmentName}</h3>
        {cta}
      </header>
      <div className="utility-result-body">
        {utility.phoneNumber && (
          <p>
            <strong>Customer service:</strong> {utility.phoneNumber}
          </p>
        )}
        {utility.billPaymentUrl && (
          <p>
            <a href={utility.billPaymentUrl} target="_blank" rel="noreferrer" aria-label="Open billing portal">
              View or pay your bill
            </a>
          </p>
        )}
        {utility.departmentWebsiteUrl && (
          <p>
            <a
              href={utility.departmentWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open official website"
            >
              Official utility website
            </a>
          </p>
        )}
        {utility.oversightDepartment && (
          <p>
            <strong>Oversight:</strong> {utility.oversightDepartment}{" "}
            {utility.oversightUrl && (
              <a href={utility.oversightUrl} target="_blank" rel="noreferrer">
                Learn more
              </a>
            )}
          </p>
        )}
        {utility.grantsOrAidUrl && (
          <p>
            <a href={utility.grantsOrAidUrl} target="_blank" rel="noreferrer">
              Rebates and aid programs
            </a>
          </p>
        )}
        {utility.summaryLines?.length > 0 && (
          <ul className="utility-summary-list">
            {utility.summaryLines.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
};

export default UtilityResultCard;
