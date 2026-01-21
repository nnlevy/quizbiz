import { usePageMeta } from "../hooks/usePageMeta";
import { RouterLink } from "./router";

const EjectWater = () => {
  usePageMeta({
    title: "Eject water shortcut | WaterShortcut",
    description:
      "Use the Water Eject shortcut to clear water from your iPhone speaker. WaterShortcut helps you save water too.",
    canonicalPath: "/eject-water",
  });

  return (
    <section className="ws-page" aria-labelledby="eject-title">
      <div className="ws-hero">
        <p className="eyebrow">iOS-only shortcut</p>
        <h1 id="eject-title">Eject water from your iPhone speaker.</h1>
        <p>
          This shortcut plays a low-frequency tone that helps push water out of the speaker grills.
          Use it after rain or accidental splashes.
        </p>
      </div>

      <div className="ws-cta-card">
        <h2>Run the shortcut</h2>
        <a
          className="ws-button"
          href="https://www.icloud.com/shortcuts/2b7d9b2d1b8345f0a8b6b1aa2bfe6f6e"
          target="_blank"
          rel="noreferrer"
        >
          Open iOS Shortcut
        </a>
        <RouterLink className="ws-footer-link" to="/analyze-water-bill">
          Back to savings mode →
        </RouterLink>
      </div>
    </section>
  );
};

export default EjectWater;
