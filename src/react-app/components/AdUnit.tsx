import { useEffect, useRef } from "react";

type AdUnitProps = {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
};

const DEFAULT_STYLE: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "250px",
};

const AdUnit = ({ slot, format = "auto", style = DEFAULT_STYLE }: AdUnitProps) => {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if ((window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle && adRef.current) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdSense push failed", error);
      }
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ ...DEFAULT_STYLE, ...style }}
      data-ad-client="ca-pub-1860356577073395"
      data-ad-slot={slot}
      data-ad-format={format}
      ref={adRef}
    />
  );
};

export default AdUnit;
