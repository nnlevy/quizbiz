import { useEffect } from "react";

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
};
