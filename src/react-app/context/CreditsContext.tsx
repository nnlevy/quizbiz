import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type CreditsContextValue = {
  credits: number;
  pulse: boolean;
  deduct: (amount: number) => number | null;
  refund: (amount: number) => number;
  setCredits: (amount: number) => void;
  setPulse: (value: boolean) => void;
};

const CreditsContext = createContext<CreditsContextValue | undefined>(undefined);

export const CreditsProvider = ({ children }: PropsWithChildren) => {
  const [credits, setCredits] = useState(5);
  const [pulse, setPulse] = useState(false);

  const deduct = useCallback(
    (amount: number) => {
      if (!Number.isFinite(amount) || amount <= 0) {
        return credits;
      }
      if (credits - amount < 0) {
        return null;
      }
      const nextCredits = credits - amount;
      setCredits(nextCredits);
      setPulse(true);
      setTimeout(() => setPulse(false), 650);
      return nextCredits;
    },
    [credits],
  );

  const refund = useCallback(
    (amount: number) => {
      if (!Number.isFinite(amount) || amount <= 0) {
        return credits;
      }
      const nextCredits = credits + amount;
      setCredits(nextCredits);
      return nextCredits;
    },
    [credits],
  );

  const value = useMemo(
    () => ({ credits, pulse, deduct, refund, setCredits, setPulse }),
    [credits, pulse, deduct, refund],
  );

  return <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>;
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
};
