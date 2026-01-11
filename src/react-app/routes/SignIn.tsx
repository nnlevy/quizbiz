import { useEffect } from "react";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { RouterLink } from "./router";
import { useCreditsModal } from "../context/CreditsModalContext";

const SignIn = () => {
  useDocumentTitle("WaterShortcut | Sign in");
  const { openModal } = useCreditsModal();

  const handleGoogle = () => {
    const returnTo =
      typeof window === "undefined"
        ? "/dashboard"
        : `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const params = new URLSearchParams({ return_to: returnTo });
    window.location.assign(`/auth/google?${params.toString()}`);
  };

  useEffect(() => {
    openModal();
  }, [openModal]);

  return (
    <section className="ws-page" aria-labelledby="sign-in-title">
      <div className="ws-hero">
        <p className="eyebrow">Welcome back</p>
        <h1 id="sign-in-title">Sign in to keep your savings plan on track.</h1>
        <p>Access your dashboard, alerts, and saved analysis history.</p>
      </div>

      <div className="ws-info-card">
        <h2>Use the account modal</h2>
        <p className="ws-subtitle">
          Sign in with Google or create an email account from the same modal experience.
        </p>
        <div className="ws-tool-grid">
          <button className="ws-button" type="button" onClick={handleGoogle}>
            Continue with Google
          </button>
          <button className="ws-button-secondary" type="button" onClick={() => openModal()}>
            Use email sign-in
          </button>
        </div>
      </div>

      <p className="ws-subtitle">
        New here? <RouterLink to="/sign-up">Create an account</RouterLink>
      </p>
    </section>
  );
};

export default SignIn;
