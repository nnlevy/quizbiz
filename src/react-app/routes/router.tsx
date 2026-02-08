/* eslint-disable react-refresh/only-export-components */
import {
  AnchorHTMLAttributes,
  MouseEvent,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { buildReferralHref } from "../utils/referralLinks";

type LocationState = {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
};

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

type RouterContextValue = {
  location: LocationState;
  navigate: (to: string, options?: NavigateOptions) => void;
};

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

const readLocation = (): LocationState => ({
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
  state: (window.history.state as { __ws_state?: unknown } | null)?.__ws_state ?? null,
});

export const RouterProvider = ({ children }: PropsWithChildren) => {
  const [location, setLocation] = useState<LocationState>(() =>
    typeof window === "undefined" ? { pathname: "/", search: "", hash: "", state: null } : readLocation(),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      setLocation(readLocation());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!location.hash) return undefined;
    const id = location.hash.replace("#", "");
    if (!id) return undefined;
    let attempts = 0;
    const maxAttempts = 12;
    let timeoutId: number | null = null;

    const tryScroll = () => {
      const target = document.getElementById(id);
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }
      attempts += 1;
      if (attempts >= maxAttempts) {
        return;
      }
      timeoutId = window.setTimeout(tryScroll, 120);
    };

    tryScroll();

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [location.hash, location.pathname]);

  const navigate = useCallback((to: string, options?: NavigateOptions) => {
    if (typeof window === "undefined") return;
    const resolvedHref = buildReferralHref(to);
    const nextState = { __ws_state: options?.state ?? null };
    if (options?.replace) {
      window.history.replaceState(nextState, "", resolvedHref);
    } else {
      window.history.pushState(nextState, "", resolvedHref);
    }
    setLocation(readLocation());
  }, []);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export const useNavigate = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useNavigate must be used within RouterProvider");
  }
  return context.navigate;
};

export const useLocation = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useLocation must be used within RouterProvider");
  }
  return context.location;
};

const isModifiedEvent = (event: MouseEvent<HTMLAnchorElement>) =>
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

type RouterLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  reloadDocument?: boolean;
};

export const RouterLink = ({
  to,
  onClick,
  children,
  reloadDocument = false,
  ...rest
}: RouterLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const resolvedHref = buildReferralHref(to);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      isModifiedEvent(event) ||
      reloadDocument ||
      rest.target === "_blank" ||
      to.startsWith("http") ||
      to.startsWith("mailto:")
    ) {
      return;
    }
    event.preventDefault();
    navigate(resolvedHref);
  };

  const isActive = location.pathname === to;

  return (
    <a href={resolvedHref} onClick={handleClick} aria-current={isActive ? "page" : undefined} {...rest}>
      {children}
    </a>
  );
};
