import { RefObject, useEffect, useState } from "react";

type UseNearViewportOptions = {
  rootMargin?: string;
};

export const useNearViewport = <T extends Element>(
  ref: RefObject<T | null>,
  options: UseNearViewportOptions = {},
) => {
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isNear) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: options.rootMargin ?? "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [isNear, options.rootMargin, ref]);

  return isNear;
};
