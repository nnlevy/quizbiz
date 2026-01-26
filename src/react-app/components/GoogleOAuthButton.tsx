import { useEffect, useState } from "react";

import type { UserProfile } from "../utils/dashboard";
import { loadScript } from "../lib/loadScript";

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
  const clientId = typeof window !== "undefined" ? window.__WS_GOOGLE_CLIENT_ID__ : undefined;

  useEffect(() => {
    if (!clientId) return;
    loadScript({
      id: "google-identity-service",
      src: "https://accounts.google.com/gsi/client",
      async: true,
      strategies: [{ type: "idle", timeout: 1800 }],
    }).catch(() => undefined);
  }, [clientId]);

  const handleGoogleAuth = async () => {
    // Setup instructions:
    // 1. Create a Google Cloud OAuth Client ID for "Web application".
    // 2. Add your deployed origin (e.g., https://www.watershortcut.com) to Authorized JavaScript origins.
    // 3. Set OAUTH_Client_ID so the Worker injects window.__WS_GOOGLE_CLIENT_ID__.
    if (!clientId) {
      setNotice("Google sign-in is not configured yet. Add your client ID to enable it.");
      return;
    }
    try {
      await loadScript({
        id: "google-identity-service",
        src: "https://accounts.google.com/gsi/client",
        async: true,
      });
    } catch {
      setNotice("Google sign-in script failed to load. Try again in a moment.");
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
