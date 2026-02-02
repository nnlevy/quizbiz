import { SVGProps, useId } from "react";

type WaterShortcutLogoProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

const WaterShortcutLogo = ({ title = "WaterShortcut logo", ...props }: WaterShortcutLogoProps) => {
  const titleId = useId();

  return (
    <svg
      role="img"
      aria-label={title}
      aria-labelledby={titleId}
      viewBox="0 0 64 64"
      {...props}
    >
      <title id={titleId}>{title}</title>
      <path
        d="M32 6C23.5 17.2 16 28.8 16 39.2 16 49.6 23.2 57 32 57s16-7.4 16-17.8C48 28.8 40.5 17.2 32 6z"
        fill="currentColor"
      />
      <path
        d="M8 45.5c4.2 3.5 8.6 5.2 13 5.2s8.8-1.7 13-5.2c4.2-3.5 8.6-5.2 13-5.2s8.8 1.7 13 5.2V57H8V45.5z"
        fill="var(--ws-logo-secondary)"
      />
    </svg>
  );
};

export default WaterShortcutLogo;
