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

type LocationState = {
  pathname: string;
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
  hash: window.location.hash,
  state: (window.history.state as { __ws_state?: unknown } | null)?.__ws_state ?? null,
});

export const RouterProvider = ({ children }: PropsWithChildren) => {
  const [location, setLocation] = useState<LocationState>(() =>
    typeof window === "undefined" ? { pathname: "/", hash: "", state: null } : readLocation(),
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
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  const navigate = useCallback((to: string, options?: NavigateOptions) => {
    if (typeof window === "undefined") return;
    const nextState = { __ws_state: options?.state ?? null };
    if (options?.replace) {
      window.history.replaceState(nextState, "", to);
    } else {
      window.history.pushState(nextState, "", to);
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
};

export const RouterLink = ({ to, onClick, children, ...rest }: RouterLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      isModifiedEvent(event) ||
      rest.target === "_blank" ||
      to.startsWith("http") ||
      to.startsWith("mailto:")
    ) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  const isActive = location.pathname === to;

  return (
    <a href={to} onClick={handleClick} aria-current={isActive ? "page" : undefined} {...rest}>
      {children}
    </a>
  );
};
