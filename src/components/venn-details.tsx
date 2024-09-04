import clsx from "clsx";
import { motion } from "framer-motion";
import { listItemVariant, listVariant } from "../utils/motion-variants";
import { ChevronRight, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { slugify } from "../utils";

export const VennDetails = ({
  questions,
  label,
  isOpen,
  onToggle,
  breakPoint,
}: {
  label: string;
  questions: {
    text: string;
    answer: string;
  }[];
  isOpen?: boolean;
  onToggle?: () => void;
  breakPoint?: "laptop" | "tablet";
}) => {
  return (
    <motion.details
      open={isOpen}
      className={clsx(
        "flex bg-white  w-full relative border-4 border-solid border-peach  flex-col flex-shrink-0 group shadow-sm shadow-peach",
        breakPoint === "laptop" && "xl:w-[300px]",
        breakPoint === "tablet" && "lg:w-[300px]"
      )}
    >
      <summary
        onClick={(e) => {
          e.preventDefault();
          onToggle?.();
        }}
        className="font-semibold  [&::-webkit-details-marker]:hidden cursor-pointer flex text-base p-3 justify-between items-center w-full bg-peach text-white"
      >
        <span>
          {label} ({questions.length})
        </span>
        <ChevronRight className="w-5 h-5 ml-2 group-open:rotate-90 transition-transform" />
      </summary>
      <motion.ul
        variants={listVariant}
        initial="hide"
        key={label}
        animate={"show"}
        exit={"hide"}
        className="list-none flex-grow [--overflow-shadow-bg:var(--tw-lightBeige)] overflow-shadow-vertical scrollbar-thumb-peach scrollbar-track-lightBeige bg-lightBeige scrollbar-thin overflow-y-auto list-inside flex p-3  flex-col divide-y  w-full xxl:h-[500px] h-[300px]"
      >
        {questions.map(({ text, answer }) => {
          return (
            <motion.li
              variants={listItemVariant}
              key={`${slugify(text)}-${answer}`}
              className="py-3 first:pt-0 last:pb-0 flex flex-col gap-1"
            >
              <div className="flex text-lg items-center gap-1">
                {answer === "1" ? (
                  <ThumbsUpIcon className="w-4 h-4" />
                ) : (
                  <ThumbsDownIcon className="w-4 h-4" />
                )}
                <span className="font-semibold">
                  {answer === "1" ? "Stimme zu" : "Stimme nicht zu"}
                </span>
              </div>
              <p className="">{text}</p>
            </motion.li>
          );
        })}
      </motion.ul>
    </motion.details>
  );
};
