import { FormEvent, useState } from "react";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { RouterLink, useNavigate } from "./router";
import GoogleOAuthButton from "../components/GoogleOAuthButton";
import { storeUser, type UserProfile } from "../utils/dashboard";

const SignIn = () => {
  useDocumentTitle("WaterShortcut | Sign in");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const profile: UserProfile = {
      id: `${Date.now()}`,
      name: email.split("@")[0] || "Water saver",
      email: email.trim(),
      provider: "email",
    };
    storeUser(profile);
    navigate("/dashboard");
  };

  const handleGoogle = (profile: UserProfile) => {
    storeUser(profile);
    navigate("/dashboard");
  };

  return (
    <section className="ws-page" aria-labelledby="sign-in-title">
      <div className="ws-hero">
        <p className="eyebrow">Welcome back</p>
        <h1 id="sign-in-title">Sign in to keep your savings plan on track.</h1>
        <p>Access your dashboard, alerts, and saved analysis history.</p>
      </div>

      <form className="ws-form ws-info-card" onSubmit={handleSubmit}>
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
            placeholder="Your password"
            required
          />
        </label>
        <button className="ws-button" type="submit">
          Sign in
        </button>
        <GoogleOAuthButton label="Continue with Google" onSuccess={handleGoogle} />
      </form>

      <p className="ws-subtitle">
        New here? <RouterLink to="/sign-up">Create an account</RouterLink>
      </p>
    </section>
  );
};

export default SignIn;
