import { Variants } from "framer-motion";

export const listVariant: Variants = {
  show: {
    // opacity: 1,

    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  hide: {
    // opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

export const listItemVariant: Variants = {
  hide: {
    opacity: 0,
    y: -20,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};
