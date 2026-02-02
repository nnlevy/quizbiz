import { type ReactNode } from "react";
import "./Card.css";

type CardProps = {
  title?: string;
  children: ReactNode;
  id?: string;
  className?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

const Card = ({ title, children, id, className, headingLevel = 3 }: CardProps) => {
  const HeadingTag = `h${headingLevel}` as const;
  const titleId = id ? `${id}-title` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={title && titleId ? titleId : undefined}
      className={`ws-card${className ? ` ${className}` : ""}`}
    >
      {title ? (
        <div className="ws-card__header">
          <HeadingTag id={titleId} className="ws-card__title">
            {title}
          </HeadingTag>
        </div>
      ) : null}
      {children}
    </section>
  );
};

export default Card;
