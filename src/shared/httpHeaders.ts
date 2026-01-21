export const appendVary = (headers: Headers, value: string): void => {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", value);
    return;
  }
  if (existing.trim() === "*") {
    return;
  }
  const nextValues = existing
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const alreadyIncluded = nextValues.some(
    (entry) => entry.toLowerCase() === value.toLowerCase(),
  );
  if (!alreadyIncluded) {
    nextValues.push(value);
    headers.set("Vary", nextValues.join(", "));
  }
};
