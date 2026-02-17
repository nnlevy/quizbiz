type DropletCheckIconProps = {
  className?: string;
};

const DropletCheckIcon = ({ className }: DropletCheckIconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M12 2.5c3.1 3 5.2 6.4 5.2 9.6A5.2 5.2 0 0 1 12 17.3a5.2 5.2 0 0 1-5.2-5.2c0-3.2 2.1-6.6 5.2-9.6Z"
      fill="currentColor"
      opacity="0.2"
    />
    <path
      d="M12 3.6c2.6 2.6 4.4 5.8 4.4 8.5a4.4 4.4 0 0 1-8.8 0c0-2.7 1.8-5.9 4.4-8.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="m9.5 12 1.8 1.8 3.4-3.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DropletCheckIcon;
