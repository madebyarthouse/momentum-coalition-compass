import { WahlkabineElectionWrapperMinimal } from "../wahlkabine-data/types";
import { motion } from "framer-motion";
import { Details } from "./details";
import clsx from "clsx";
import { useId } from "react";

export const TopicsFilter = ({
  election,
  selectedTopics,
  setSelectedTopics,
}: {
  election: WahlkabineElectionWrapperMinimal;
  selectedTopics: string[];
  setSelectedTopics: (selectedTopics: string[]) => void;
}) => {
  const id = useId();

  const topics = election?.election.questions.reduce((acc, question) => {
    if (!question.topics || question.topics.length === 0) {
      if (!acc["Kein Thema"]) {
        acc["Kein Thema"] = 0;
      }

      acc["Kein Thema"]++;

      return acc;
    }

    question.topics?.forEach((topic) => {
      if (!acc[topic]) {
        acc[topic] = 0;
      }

      acc[topic]++;
    });

    return acc;
  }, {} as Record<string, number>);

  return (
    <aside className="max-w-[700px] w-full">
      <Details summary="Themen" defaultOpen={false}>
        <div className="p-3">
          <button
            onClick={(e) => {
              e.preventDefault();

              if (selectedTopics.length === Object.keys(topics).length) {
                setSelectedTopics([]);
              } else {
                setSelectedTopics(Object.keys(topics));
              }
            }}
            className="notouch:hover:bg-peach text-center w-fit py-3 block px-3 focus-visible:bg-peach  data-[active=true]:bg-peach bg-peach/40 font-semibold data-[active=true]:text-white notouch:hover:text-white focus-visible:text-white rounded-md"
          >
            <span>
              {selectedTopics.length === Object.keys(topics).length
                ? "Keines auswählen"
                : "Alle auswählen"}
            </span>
          </button>
        </div>
        <div className="flex flex-row gap-3 p-3 flex-wrap">
          {Object.entries(topics)
            .sort((a, b) => {
              const aSelected = selectedTopics.includes(a[0]);
              const bSelected = selectedTopics.includes(b[0]);

              if (aSelected && !bSelected) {
                return -1;
              }

              if (!aSelected && bSelected) {
                return 1;
              }

              return a[0].localeCompare(b[0]);
            })
            .map(([topic, count]) => {
              const isSelected = selectedTopics.some(
                (selectedTopic) => selectedTopic === topic
              );
              return (
                <motion.label
                  layoutId={`${election._id}-${id}-topic-${topic}`}
                  key={`${election._id}-${id}-topic-${topic}`}
                  className={clsx(
                    "flex flex-row gap-2 items-center border-2 border-peach font-semibold bg-lightBeige transition-colors ease-out text-sm cursor-pointer p-2 rounded-md",
                    isSelected &&
                      "bg-peach/100 text-white notouch:hover:bg-transparent notouch:hover:text-peach",
                    !isSelected &&
                      "notouch:hover:bg-peach text-peach notouch:hover:text-white"
                  )}
                >
                  <input
                    type="checkbox"
                    value={topic}
                    className="text-peach outline-peach"
                    checked={isSelected}
                    onChange={() => {
                      if (isSelected) {
                        setSelectedTopics(
                          selectedTopics.filter(
                            (selectedTopic) => selectedTopic !== topic
                          )
                        );
                      } else {
                        setSelectedTopics([...selectedTopics, topic]);
                      }
                    }}
                  />
                  <span>
                    {topic} ({count})
                  </span>
                </motion.label>
              );
            })}
        </div>
      </Details>
    </aside>
  );
};
