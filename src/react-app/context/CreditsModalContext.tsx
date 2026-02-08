/* eslint-disable react-refresh/only-export-components */
import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from "react";

import CreditsModal from "../components/CreditsModal";

type CreditsModalContextValue = {
  isOpen: boolean;
  openModal: (options?: { returnTo?: string }) => void;
  closeModal: () => void;
};

const CreditsModalContext = createContext<CreditsModalContextValue | undefined>(undefined);

const resolveReturnTo = (value?: string) => {
  if (value) {
    return value;
  }
  if (typeof window === "undefined") {
    return "/";
  }
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

export const CreditsModalProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [returnTo, setReturnTo] = useState(() => resolveReturnTo());

  const openModal = useCallback((options?: { returnTo?: string }) => {
    setReturnTo(resolveReturnTo(options?.returnTo));
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openModal, closeModal }),
    [isOpen, openModal, closeModal],
  );

  return (
    <CreditsModalContext.Provider value={value}>
      {children}
      <CreditsModal isOpen={isOpen} returnTo={returnTo} onClose={closeModal} />
    </CreditsModalContext.Provider>
  );
};

export const useCreditsModal = () => {
  const context = useContext(CreditsModalContext);
  if (!context) {
    throw new Error("useCreditsModal must be used within a CreditsModalProvider");
  }
  return context;
};
