import { FormEvent, useState } from "react";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { RouterLink, useNavigate } from "./router";
import GoogleOAuthButton from "../components/GoogleOAuthButton";
import { storeUser, type UserProfile } from "../utils/dashboard";

const SignUp = () => {
  useDocumentTitle("WaterShortcut | Sign up");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const profile: UserProfile = {
      id: `${Date.now()}`,
      name: name.trim() || "Water saver",
      email: email.trim(),
      provider: "email",
    };
    storeUser(profile);
    setNotice("Account created! Redirecting to your dashboard...");
    window.setTimeout(() => navigate("/dashboard"), 400);
  };

  const handleGoogle = (profile: UserProfile) => {
    storeUser(profile);
    navigate("/dashboard");
  };

  return (
    <section className="ws-page" aria-labelledby="sign-up-title">
      <div className="ws-hero">
        <p className="eyebrow">Create account</p>
        <h1 id="sign-up-title">Start saving and tracking water in one place.</h1>
        <p>Sign up to unlock your dashboard, savings plan, and alerts.</p>
      </div>

      <form className="ws-form ws-info-card" onSubmit={handleSubmit}>
        <label className="ws-field">
          Name
          <input
            className="ws-input"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g., Jordan"
            required
          />
        </label>
        <label className="ws-field">
          Email
          <input
            className="ws-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            required
          />
        </label>
        <label className="ws-field">
          Password
          <input
            className="ws-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            required
          />
        </label>
        <button className="ws-button" type="submit">
          Create account
        </button>
        <GoogleOAuthButton label="Continue with Google" onSuccess={handleGoogle} />
        {notice && <p className="ws-subtitle" aria-live="polite">{notice}</p>}
      </form>

      <p className="ws-subtitle">
        Already have an account? <RouterLink to="/sign-in">Sign in</RouterLink>
      </p>
    </section>
  );
};

export default SignUp;
