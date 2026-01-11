import { useState } from "react";

import type { UserProfile } from "../utils/dashboard";

type GoogleOAuthButtonProps = {
  onSuccess: (profile: UserProfile) => void;
  label: string;
};

declare global {
  interface Window {
    __WS_GOOGLE_CLIENT_ID__?: string;
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const decodeJwt = (token: string) => {
  const [, payload] = token.split(".");
  if (!payload) return null;
  try {
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as { email?: string; name?: string };
  } catch {
    return null;
  }
};

const GoogleOAuthButton = ({ onSuccess, label }: GoogleOAuthButtonProps) => {
  const [notice, setNotice] = useState<string | null>(null);

  const handleGoogleAuth = () => {
    // Setup instructions:
    // 1. Create a Google Cloud OAuth Client ID for "Web application".
    // 2. Add your deployed origin (e.g., https://www.watershortcut.com) to Authorized JavaScript origins.
    // 3. Set window.__WS_GOOGLE_CLIENT_ID__ in index.html or via a server-side template.
    const clientId = window.__WS_GOOGLE_CLIENT_ID__;
    if (!clientId) {
      setNotice("Google sign-in is not configured yet. Add your client ID to enable it.");
      return;
    }
    if (!window.google?.accounts?.id) {
      setNotice("Google sign-in script has not loaded. Try again in a moment.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (!response.credential) {
          setNotice("Google sign-in did not return a credential.");
          return;
        }
        const profile = decodeJwt(response.credential);
        if (!profile?.email) {
          setNotice("Google sign-in did not return profile details.");
          return;
        }
        onSuccess({
          id: `${Date.now()}`,
          name: profile.name || "Google user",
          email: profile.email,
          provider: "google",
        });
      },
    });

    window.google.accounts.id.prompt();
  };

  return (
    <div>
      <button className="ws-button-secondary" type="button" onClick={handleGoogleAuth}>
        {label}
      </button>
      {notice && <p className="ws-subtitle">{notice}</p>}
    </div>
  );
};

export default GoogleOAuthButton;
