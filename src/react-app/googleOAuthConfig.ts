if (typeof window !== "undefined") {
  const globalWindow = window as typeof window & {
    __WS_GOOGLE_CLIENT_ID__?: string;
  };

  // Optional Google OAuth configuration; set to your client ID for GIS sign-in.
  globalWindow.__WS_GOOGLE_CLIENT_ID__ = "";
}
