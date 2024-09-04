import clsx from "clsx";
import { ArrowRightCircle } from "lucide-react";
import { useState } from "react";

export const Details = ({
  children,
  className,
  summary,
  defaultOpen,
  iconSize = 20,
}: {
  children?: React.ReactNode;
  className?: string;
  summary: string | React.ReactNode;
  defaultOpen?: boolean;
  iconSize?: number;
}) => {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <details
      className={clsx(
        "[--details-color-internal:var(--details-color,var(--tw-peach))] group/details",
        className
      )}
      open={open}
    >
      <summary
        className={clsx(
          "font-semibold  border-l-4 border-[var(--details-color-internal)] flex flex-row justify-between items-center gap-3 appearance-none transition-all [&::-webkit-details-marker]:hidden px-2 py-1",
          children &&
            "cursor-pointer notouch:hover:bg-[var(--details-color-internal)] focus-visible:bg-[var(--details-color-internal)] notouch:hover:text-white focus-visible:text-white group-open/details:text-white group-open/details:bg-[var(--details-color-internal)]",
          !children && "cursor-default"
        )}
        tabIndex={children ? 0 : -1}
        onClick={(e) => {
          e.preventDefault();
          setOpen((open) => !open);
        }}
      >
        <span className="text-lg">{summary}</span>
        {children && (
          <ArrowRightCircle
            style={{ width: iconSize, height: iconSize }}
            className="flex-shrink-0 group-open/details:rotate-90 transition-transform mr-2"
          />
        )}
      </summary>
      {children && (
        <div className="border-l-4 border-[var(--details-color-internal)]">
          {children}
        </div>
      )}
    </details>
  );
};
