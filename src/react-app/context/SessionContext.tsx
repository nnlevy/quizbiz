import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useCredits } from "./CreditsContext";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  provider: "email" | "google";
  credits: number;
};

type SessionStatus = "idle" | "loading" | "ready" | "error";

type SessionContextValue = {
  user: SessionUser | null;
  status: SessionStatus;
  error: string | null;
  refreshSession: () => Promise<void>;
  clearSession: () => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const { setCredits } = useCredits();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch("/me", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Session check failed (${response.status}).`);
      }
      const payload = (await response.json()) as {
        user?: SessionUser | null;
        credits?: number;
      };
      if (typeof payload.credits === "number") {
        setCredits(payload.credits);
      }
      setUser(payload.user ?? null);
      setStatus("ready");
    } catch (sessionError) {
      setStatus("error");
      setError(sessionError instanceof Error ? sessionError.message : "Unable to load session.");
    }
  }, [setCredits]);

  const clearSession = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    refreshSession().catch(() => undefined);
  }, [refreshSession]);

  const value = useMemo(
    () => ({ user, status, error, refreshSession, clearSession }),
    [user, status, error, refreshSession, clearSession],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
