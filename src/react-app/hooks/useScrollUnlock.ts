import { useEffect, useState } from "react";

const SCROLL_UNLOCK_KEY = "ws_scroll_unlocked";
const RETURNING_USER_KEY = "ws_returning_user";

export const useScrollUnlock = () => {
  const [isReturningUser, setIsReturningUser] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(RETURNING_USER_KEY) === "true";
  });
  const [scrollUnlocked, setScrollUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SCROLL_UNLOCK_KEY) === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isReturningUser) {
      window.localStorage.setItem(RETURNING_USER_KEY, "true");
      setIsReturningUser(true);
    }
  }, [isReturningUser]);

  useEffect(() => {
    if (typeof window === "undefined" || scrollUnlocked) return;

    const threshold = () => window.innerHeight * 0.95;

    const checkScroll = () => {
      if (window.scrollY >= threshold()) {
        window.localStorage.setItem(SCROLL_UNLOCK_KEY, "true");
        setScrollUnlocked(true);
      }
    };

    const handleScroll = () => {
      window.requestAnimationFrame(checkScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    checkScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollUnlocked]);

  return { scrollUnlocked, isReturningUser };
};
