import SiteFooter from "../react-app/components/SiteFooter";
import SiteNav from "../react-app/components/SiteNav";
import "../react-app/App.css";

const PageLayout = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div className="app content-page">
    <SiteNav />
    <main className="content-wrapper">
      <div className="content-hero">
        <p className="eyebrow">WaterShortcut Learn</p>
        <h1>{title}</h1>
        {subtitle ? <p className="hero-copy">{subtitle}</p> : null}
      </div>
      <div className="content-body">{children}</div>
    </main>
    <SiteFooter />
  </div>
);

export default PageLayout;
