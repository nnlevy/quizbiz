import { getEffectiveConsent, subscribeToConsentChanges, type ConsentState } from "../consent";

type ConsentCategory = keyof ConsentState;

type ConsentStrategy = {
  type: "consent";
  category: ConsentCategory;
};

type IdleStrategy = {
  type: "idle";
  timeout?: number;
};

type VisibleStrategy = {
  type: "visible";
  element: Element | null;
  rootMargin?: string;
};

type InteractionStrategy = {
  type: "interaction";
  element?: Element | Window;
  events?: Array<"click" | "pointerdown" | "keydown" | "touchstart">;
};

type LoadStrategy = ConsentStrategy | IdleStrategy | VisibleStrategy | InteractionStrategy;

type ScriptLoadOptions = {
  src: string;
  id?: string;
  async?: boolean;
  defer?: boolean;
  attributes?: Record<string, string>;
  strategies?: LoadStrategy[];
};

const loadPromises = new Map<string, Promise<HTMLScriptElement>>();

const getKey = ({ src, id }: ScriptLoadOptions) => id ?? src;

const ensureScript = (options: ScriptLoadOptions): Promise<HTMLScriptElement> => {
  const key = getKey(options);
  const existing = options.id ? (document.getElementById(options.id) as HTMLScriptElement | null) : null;
  if (existing?.src === options.src) {
    return Promise.resolve(existing);
  }
  const found = document.querySelector<HTMLScriptElement>(`script[src="${options.src}"]`);
  if (found) {
    return Promise.resolve(found);
  }

  if (loadPromises.has(key)) {
    return loadPromises.get(key)!;
  }

  const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = options.src;
    script.async = options.async ?? true;
    script.defer = options.defer ?? false;
    if (options.id) {
      script.id = options.id;
    }
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([attr, value]) => {
        script.setAttribute(attr, value);
      });
    }
    script.addEventListener("load", () => resolve(script), { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error(`Failed to load script: ${options.src}`)),
      { once: true },
    );
    document.head.appendChild(script);
  });

  loadPromises.set(key, promise);
  return promise;
};

const waitForConsent = (category: ConsentCategory) =>
  new Promise<void>((resolve) => {
    const current = getEffectiveConsent();
    if (current[category]) {
      resolve();
      return;
    }
    const unsubscribe = subscribeToConsentChanges((next) => {
      if (next[category]) {
        unsubscribe();
        resolve();
      }
    });
  });

const waitForIdle = (timeout?: number) =>
  new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const idleCallback =
      (window as Window & { requestIdleCallback?: (cb: () => void, options?: { timeout?: number }) => number })
        .requestIdleCallback ??
      ((cb: () => void, options?: { timeout?: number }) => window.setTimeout(cb, options?.timeout ?? 200));
    idleCallback(() => resolve(), { timeout: timeout ?? 1_200 });
  });

const waitForVisible = (element: Element | null, rootMargin = "200px") =>
  new Promise<void>((resolve) => {
    if (!element || typeof window === "undefined") {
      resolve();
      return;
    }
    if (!("IntersectionObserver" in window)) {
      resolve();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          resolve();
        }
      },
      { rootMargin },
    );
    observer.observe(element);
  });

const waitForInteraction = (options?: InteractionStrategy) =>
  new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const target = options?.element ?? window;
    const events = options?.events ?? ["pointerdown", "keydown", "touchstart"];
    const handler = () => {
      events.forEach((event) => target.removeEventListener(event, handler));
      resolve();
    };
    events.forEach((event) => target.addEventListener(event, handler, { once: true }));
  });

export const loadScript = async (options: ScriptLoadOptions) => {
  if (typeof document === "undefined") {
    return Promise.reject(new Error("Document not available"));
  }

  const strategies = options.strategies ?? [];
  if (strategies.length === 0) {
    return ensureScript(options);
  }

  const waits = strategies.map((strategy) => {
    switch (strategy.type) {
      case "consent":
        return waitForConsent(strategy.category);
      case "idle":
        return waitForIdle(strategy.timeout);
      case "visible":
        return waitForVisible(strategy.element, strategy.rootMargin);
      case "interaction":
        return waitForInteraction(strategy);
      default:
        return Promise.resolve();
    }
  });

  await Promise.all(waits);
  return ensureScript(options);
};
