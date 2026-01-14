import { useEffect, useRef } from "react";

import { ADSENSE_CLIENT as DEFAULT_ADSENSE_CLIENT } from "../../config/adsense";
import { requestAdForSlot, subscribeToRouteChanges } from "../adsense";
import { isAdTypeEnabled, type AdType } from "../ads/adPolicy";

const ADSENSE_CLIENT =
  (typeof window !== "undefined" &&
    (window as typeof window & { __WS_ADSENSE_CLIENT__?: string }).__WS_ADSENSE_CLIENT__) ||
  DEFAULT_ADSENSE_CLIENT;

type AdFormat = "auto" | "autorelaxed" | "fluid";

type AdSenseSlotProps = {
  slotId: string;
  adType?: AdType;
  format?: AdFormat;
  fullWidthResponsive?: boolean;
  layoutKey?: string;
  className?: string;
};

const AdSenseSlot = ({
  slotId,
  adType = "inline",
  format = "auto",
  fullWidthResponsive = true,
  layoutKey,
  className,
}: AdSenseSlotProps) => {
  const slotRef = useRef<HTMLModElement>(null!);
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;
  const isEnabled = typeof window === "undefined" ? true : isAdTypeEnabled(pathname, adType);

  useEffect(() => {
    if (!isEnabled) return undefined;
    const slot = slotRef.current;
    if (!slot) return undefined;

    const initialize = () => requestAdForSlot(slot);
    initialize();

    const unsubscribe = subscribeToRouteChanges(initialize);
    return unsubscribe;
  }, [slotId, format, fullWidthResponsive, layoutKey, isEnabled]);

  if (!isEnabled) return null;

  return (
    <ins
      ref={slotRef}
      className={`adsbygoogle${className ? ` ${className}` : ""}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slotId}
      data-ad-type={adType}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
    />
  );
};

export default AdSenseSlot;
