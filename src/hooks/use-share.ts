import { useEffect, useState } from "react";

export const useShare = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 750);

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const share = async ({
    title,
    text,
    files,
    link = true,
  }: {
    title: string;
    text?: string;
    files?: File[];
    link?: boolean;
  }) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          files,
          url: link ? window.location.href : undefined,
        });
        setCopied(true);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    copied,
    share,
  };
};
