import { AnimatePresence, useInView, motion } from "framer-motion";
import { ReactNode, useId, useRef } from "react";

export const LazyList = ({
  children,
  itemClassName,
}: {
  children: ReactNode[];
  itemClassName?: string;
}) => {
  const id = useId();
  return children.map((child, index) => (
    <LazyListItem
      className={itemClassName}
      key={`${id}-${child?.toString()}-${index}`}
    >
      {child}
    </LazyListItem>
  ));
};

export const LazyListItem = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInview = useInView(itemRef, {
    amount: 0.2,
    margin: "100px",
  });
  const height = isInview ? 0 : itemRef.current?.offsetHeight ?? 500;

  return (
    <AnimatePresence mode="wait">
      <div className={className} ref={itemRef} style={{ minHeight: height }}>
        {isInview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center"></div>
        )}
      </div>
    </AnimatePresence>
  );
};
