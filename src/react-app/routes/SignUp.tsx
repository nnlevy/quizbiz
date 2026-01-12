import { useEffect } from "react";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { RouterLink } from "./router";
import { useCreditsModal } from "../context/CreditsModalContext";

const SignUp = () => {
  useDocumentTitle("WaterShortcut | Sign up");
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
    <section className="ws-page" aria-labelledby="sign-up-title">
      <div className="ws-hero">
        <p className="eyebrow">Create account</p>
        <h1 id="sign-up-title">Create your WaterShortcut account.</h1>
        <p>Continue with Google or create an email account in the modal.</p>
      </div>

      <div className="ws-info-card">
        <h2>Use the account modal</h2>
        <p className="ws-subtitle">
          We&apos;ve moved sign-up into a quick modal so you can stay on the page you were browsing.
        </p>
        <div className="ws-tool-grid">
          <button className="ws-button" type="button" onClick={handleGoogle}>
            Continue with Google
          </button>
          <button className="ws-button-secondary" type="button" onClick={() => openModal()}>
            Create account with email
          </button>
        </div>
      </div>

      <p className="ws-subtitle">
        Already have an account? <RouterLink to="/sign-in">Sign in</RouterLink>
      </p>
    </section>
  );
};

export default SignUp;
