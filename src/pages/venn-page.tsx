import { useLocalStorage } from "@uidotdev/usehooks";
import { WahlkabineElectionWrapperMinimal } from "../wahlkabine-data/types";
import { useCallback, useId, useMemo } from "react";
import { ElectionVennController } from "../components/election-venn-controller";
import { buildElectionVennData, getTopics } from "../utils";
import { ArrowDown, ArrowUp, FilterIcon } from "lucide-react";
import { TopicsFilter } from "../components/topics-filter";
import { PartiesFilter } from "../components/parties-filter";
import { LazyList } from "../components/lazy-list";
import clsx from "clsx";

export const VennPage = ({
  election,
  sourcePath = "",
  breakPoint = "tablet",
  showCredits = false,
  embed = false,
}: {
  election: WahlkabineElectionWrapperMinimal;
  showCredits?: boolean;
  sourcePath?: string;
  breakPoint?: "laptop" | "tablet";
  embed?: boolean;
}) => {
  const parties = election?.election.parties;
  const id = useId();
  const [mode, setMode] = useLocalStorage<
    "single" | "2-combos" | "3-combos" | "all"
  >(`mode-${election._id}`, "single");

  const topics = getTopics(election);

  const [sortDirection, setSortDirection] = useLocalStorage<"asc" | "desc">(
    `sort-direction-${id}-${election._id}`,
    "desc"
  );

  const [selectedTopics, setSelectedTopics] = useLocalStorage<string[]>(
    `selected-topics-${id}-${election._id}`,
    Object.keys(topics)
  );

  const [filteredParties, setFilteredParties] = useLocalStorage<string[]>(
    `filtered-parties-${id}-${election._id}`,
    election?.election.parties.map((party) => party._id)
  );

  const partyForId = useCallback(
    (partyId: string) => {
      return election?.election.parties.find((party) => party._id === partyId);
    },
    [election]
  );

  const combinations = useMemo(() => {
    const filterCombinations = (combination: string[]) => {
      return combination.every((partyId) => filteredParties.includes(partyId));
    };

    const partyIds = parties.map((party) => party._id);
    const randomParties = partyIds
      .filter((party) => filteredParties.includes(party))
      .sort(() => Math.random() - 0.5)
      .slice(0, mode === "2-combos" ? 2 : 3);

    const combinations: string[][] = [];

    if (mode === "single") {
      return [randomParties];
    }

    if (mode === "2-combos" || mode == "all") {
      combinations.push(
        ...getAllCombinations(partyIds, 2).filter(
          (combination) => combination.length === 2
        )
      );
    }

    if (mode === "3-combos" || mode == "all") {
      combinations.push(
        ...getAllCombinations(partyIds, 3).filter(
          (combination) => combination.length === 3
        )
      );
    }

    combinations.sort((a, b) => {
      const aMatching = buildElectionVennData({
        partyForId,
        filteredSelectedParties: a,
        election,
      });

      const bMatching = buildElectionVennData({
        partyForId,
        filteredSelectedParties: b,
        election,
      });

      if (sortDirection === "asc") {
        return aMatching.matchingScore - bMatching.matchingScore;
      } else {
        return bMatching.matchingScore - aMatching.matchingScore;
      }
    });

    const filteredCombinations = combinations.filter(filterCombinations);

    return filteredCombinations;
  }, [parties, mode, filteredParties, partyForId, election, sortDirection]);

  return (
    <div
      className={clsx(
        "w-[1000px] xxl:w-[1200px] max-w-full flex flex-col twp",
        embed && "md:border-l border-black"
      )}
    >
      <div className="px-3 md:px-5 lg:px-10 lg:sticky lg:z-50 shadow-sm bg-lightBeige lg:top-0 xl:px-14 xxl:px-16 py-5 border-b lg:border-r border-black  flex sm:flex-row flex-col lg:gap-10 justify-between items-start gap-4">
        <div className="flex flex-col w-full sm:w-fit">
          <span className="font-semibold text-sm border border-black border-b-0 md:text-base px-3 py-1">
            Anzeige-Modus ({combinations.length}):
          </span>
          <select
            className="px-3 py-2"
            value={mode}
            onChange={(event) =>
              setMode(
                event.target.value as "single" | "2-combos" | "3-combos" | "all"
              )
            }
          >
            <option value="single">Einzelauswahl</option>
            <option value="2-combos">Alle 2er Kombinationen</option>
            <option value="3-combos">Alle 3er Kombinationen</option>
            <option value="all">Alle Kombinationen (exkl. 4er)</option>
          </select>
        </div>

        <div className="flex flex-row items-start">
          <details className="flex flex-col  group w-full">
            <summary className="[&::-webkit-details-marker]:hidden flex sm:justify-end items-end  w-full">
              <div className="flex text-lg justify-end group-open:border-b-0 font-semibold cursor-pointer px-2 py-1 md:w-fit items-end notouch:hover:bg-black transition-all focus-visible:bg-black notouch:hover:text-white group-open:bg-black group-open:text-white focus-visible:text-white border border-black gap-1">
                <span>Filter</span>
                <FilterIcon className="w-7 h-7" />
              </div>
            </summary>

            <div className="flex flex-col border p-3 gap-10 border-black">
              <PartiesFilter
                parties={election?.election.parties}
                selectedParties={filteredParties}
                setSelectedParties={setFilteredParties}
              />
              <TopicsFilter
                election={election}
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
              />
            </div>
          </details>
          {mode !== "single" && (
            <button
              onClick={() => {
                if (sortDirection === "asc") {
                  setSortDirection("desc");
                } else {
                  setSortDirection("asc");
                }
              }}
              className="px-3 py-1 border-black border font-semibold notouch:hover:bg-black transition-all focus-visible:bg-black notouch:hover:text-white text-lg flex items-center focus-visible:text-white gap-1"
            >
              Sort{" "}
              <ArrowDown
                className={clsx(
                  "transition-transform w-7 h-7",
                  sortDirection === "asc" && "-rotate-180"
                )}
              />
            </button>
          )}
        </div>
      </div>
      <section className="flex divide-y divide-black flex-grow flex-col flex-wrap">
        <LazyList itemClassName="w-full lg:border-r border-black">
          {combinations.map((combo) => {
            return (
              <div
                className="py-10 px-3 md:px-5 lg:px-10 xl:px-14 flex-grow xxl:px-16 w-full"
                key={`${election._id}-${mode}-venn-wrapper-${combo.join("-")}`}
              >
                <ElectionVennController
                  key={`${
                    election._id
                  }-${mode}-${sortDirection}-venn-controller-${combo.join(
                    "-"
                  )}`}
                  election={election}
                  defaultSelectedParties={combo}
                  filteredParties={filteredParties}
                  showEmbedCode
                  sourcePath={sourcePath}
                  filteredTopics={selectedTopics}
                  padding="large"
                  showCredits={showCredits}
                  breakPoint={breakPoint}
                  resetToDefault={mode !== "single"}
                />
              </div>
            );
          })}
        </LazyList>
      </section>
    </div>
  );
};

const getAllCombinations = (values: string[], maxDepth: number = 3) => {
  const uniqueCombinations = new Set<string>();

  const generateCombinations = (
    prefix: string[],
    remainingValues: string[],
    depth: number
  ) => {
    if (depth === 0) {
      uniqueCombinations.add(prefix.sort().join(","));
      return;
    }

    for (let i = 0; i < remainingValues.length; i++) {
      const currentValue = remainingValues[i];
      const restValues = remainingValues.slice(i + 1);
      generateCombinations([...prefix, currentValue], restValues, depth - 1);
    }
  };

  generateCombinations([], values, maxDepth);

  return Array.from(uniqueCombinations).map((combination) =>
    combination.split(",")
  );
};
