if (typeof window !== "undefined") {
  const globalWindow = window as typeof window & {
    __WS_GOOGLE_CLIENT_ID__?: string;
  };

  // Optional Google OAuth configuration; set to your client ID for GIS sign-in.
  // In production, the Worker injects this value from OAUTH_Client_ID.
  if (globalWindow.__WS_GOOGLE_CLIENT_ID__ == null) {
    globalWindow.__WS_GOOGLE_CLIENT_ID__ = "";
  }
}
