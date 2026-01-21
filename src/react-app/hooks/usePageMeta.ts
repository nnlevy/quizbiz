import { useEffect } from "react";

type PageMeta = {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  structuredData?: Array<Record<string, unknown>>;
};

const setMetaContent = (selector: string, content: string, attributes: Record<string, string>) => {
  if (typeof document === "undefined") return;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      element?.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const upsertCanonicalLink = (href: string) => {
  if (typeof document === "undefined") return;
  let link = document.head.querySelector<HTMLLinkElement>("link[rel='canonical']");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const upsertStructuredData = (structuredData: Array<Record<string, unknown>>) => {
  if (typeof document === "undefined") return;
  const existing = document.head.querySelector<HTMLScriptElement>(
    "script[data-ws-structured-data]",
  );
  const element = existing ?? document.createElement("script");
  element.type = "application/ld+json";
  element.dataset.wsStructuredData = "true";
  element.textContent = JSON.stringify(structuredData);
  if (!existing) {
    document.head.appendChild(element);
  }
};

export const usePageMeta = ({
  title,
  description,
  canonicalPath,
  ogImage,
  twitterCard = "summary_large_image",
  structuredData,
}: PageMeta) => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const resolvedOgImage =
      ogImage ??
      "https://res.cloudinary.com/dlxzgqi9g/image/upload/f_auto,q_auto/v1735510676/watershortcut-favicon.png";
    document.title = title;
    setMetaContent("meta[name='description']", description, { name: "description" });
    setMetaContent("meta[property='og:title']", title, { property: "og:title" });
    setMetaContent("meta[property='og:description']", description, { property: "og:description" });
    setMetaContent("meta[property='og:type']", "website", { property: "og:type" });
    setMetaContent("meta[name='twitter:card']", twitterCard, { name: "twitter:card" });
    setMetaContent("meta[name='twitter:title']", title, { name: "twitter:title" });
    setMetaContent(
      "meta[name='twitter:description']",
      description,
      { name: "twitter:description" },
    );
    setMetaContent("meta[property='og:image']", resolvedOgImage, { property: "og:image" });
    setMetaContent("meta[name='twitter:image']", resolvedOgImage, { name: "twitter:image" });

    const canonicalUrl =
      canonicalPath && typeof window !== "undefined"
        ? `${window.location.origin}${canonicalPath}`
        : typeof window !== "undefined"
          ? window.location.href
          : "";
    if (canonicalUrl) {
      upsertCanonicalLink(canonicalUrl);
      setMetaContent("meta[property='og:url']", canonicalUrl, { property: "og:url" });
    }

    if (structuredData?.length) {
      upsertStructuredData(structuredData);
    }
  }, [title, description, canonicalPath, ogImage, twitterCard, structuredData]);
};
