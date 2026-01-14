export const normalizePathname = (pathname: string): string => {
  if (!pathname) return "/";
  const trimmed = pathname.split("?")[0].split("#")[0];
  if (trimmed === "") return "/";
  if (trimmed.length > 1 && trimmed.endsWith("/")) {
    return trimmed.slice(0, -1);
  }
  return trimmed;
};
