export const isIphoneUserAgent = (userAgent: string): boolean =>
  /iPhone/i.test(userAgent);

export const detectIphone = (navigatorRef?: Navigator): boolean => {
  if (!navigatorRef) return false;
  return isIphoneUserAgent(navigatorRef.userAgent);
};
