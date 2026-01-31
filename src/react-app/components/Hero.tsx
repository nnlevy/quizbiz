import { ReactNode } from "react";

type HeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  titleId: string;
  children?: ReactNode;
};

const Hero = ({ eyebrow, title, description, titleId, children }: HeroProps) => (
  <section className="ws-hero ws-hero-layout" aria-labelledby={titleId}>
    <div className="ws-hero-copy">
      <p className="eyebrow">{eyebrow}</p>
      <h1 id={titleId}>{title}</h1>
      <p className="ws-hero-lede">{description}</p>
    </div>
    {children ? <div className="ws-hero-card">{children}</div> : null}
  </section>
);

export default Hero;
