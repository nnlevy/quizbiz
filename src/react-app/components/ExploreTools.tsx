import InfoCard from "./InfoCard";
import { RouterLink } from "../routes/router";

const ExploreTools = () => (
  <InfoCard as="nav" id="more-tools" aria-label="Explore more tools" className="ws-section">
    <div className="ws-section-header">
      <p className="eyebrow">Explore more tools</p>
      <h2 className="ws-section-title">Keep learning and saving</h2>
      <p className="ws-section-lede">
        Want to browse before uploading? Try a quick quiz or build a research plan.
      </p>
    </div>
    <div className="ws-tool-grid" role="list">
      <RouterLink to="/water-iq">Take the Water IQ Challenge</RouterLink>
      <RouterLink to="/guides" reloadDocument>
        Explore water-saving guides
      </RouterLink>
      <RouterLink to="/research">Build a research plan</RouterLink>
      <RouterLink to="/calculators" reloadDocument>
        Try the calculators
      </RouterLink>
      <RouterLink to="/leak-check" reloadDocument>
        Run the leak check
      </RouterLink>
      <RouterLink to="/rebates" reloadDocument>
        Find rebates
      </RouterLink>
    </div>
  </InfoCard>
);

export default ExploreTools;
