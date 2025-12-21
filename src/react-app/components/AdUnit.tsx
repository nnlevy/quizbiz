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
    const adElement = adRef.current;
    if (!adElement) {
      return;
    }

    let hasPushed = false;

    const pushAdIfReady = () => {
      if (hasPushed) {
        return;
      }
      const width = adElement.offsetWidth;
      const height = adElement.offsetHeight;
      if (!width || !height) {
        return;
      }
      if ((window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle) {
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          hasPushed = true;
        } catch (error) {
          console.error("AdSense push failed", error);
        }
      }
    };

    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(pushAdIfReady)
      : null;

    pushAdIfReady();
    if (observer) {
      observer.observe(adElement);
    }

    return () => {
      observer?.disconnect();
    };
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
