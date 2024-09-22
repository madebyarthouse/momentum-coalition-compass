import { WahlkabineElectionWrapperMinimal } from "../wahlkabine-data/types";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useId } from "react";
import {
  getPartyColorByAbbreviation,
  getPartyLabelColorByAbbreviation,
} from "../utils/partiesWithColors";

export const PartiesFilter = ({
  parties,
  selectedParties,
  setSelectedParties,
  maxSelected,
}: {
  parties: WahlkabineElectionWrapperMinimal["election"]["parties"];
  selectedParties: string[];
  setSelectedParties: (selectedParties: string[]) => void;
  maxSelected?: number;
}) => {
  const id = useId();

  parties.sort((a, b) => {
    const isSelectedA = selectedParties.includes(a.abbreviation);
    const isSelectedB = selectedParties.includes(b.abbreviation);

    if (isSelectedA && !isSelectedB) {
      return -1;
    }

    if (!isSelectedA && isSelectedB) {
      return 1;
    }

    return a.abbreviation.localeCompare(b.abbreviation);
  });

  return (
    <aside className="flex flex-row gap-3 flex-wrap max-w-[700px] w-full">
      {parties.map((party) => {
        const isSelected = selectedParties.includes(party.abbreviation);

        const isDisabled =
          maxSelected !== undefined
            ? !isSelected && selectedParties.length === maxSelected
            : false;

        return (
          <motion.label
            style={{
              backgroundColor: getPartyColorByAbbreviation(party.abbreviation),
              color: getPartyLabelColorByAbbreviation(party.abbreviation),
            }}
            animate={{
              opacity: isSelected ? 1 : 0.7,
            }}
            whileHover={{
              opacity: isSelected ? 0.9 : 1,
            }}
            layoutId={`${id}-checkbox-${party.abbreviation}`}
            key={`${id}-checkbox-${party.abbreviation}`}
            className={clsx(
              "flex flex-row gap-2 transition-opacity items-center px-2 py-1 text-white font-semibold rounded-sm shadow-md",
              isDisabled && "opacity-50 cursor-not-allowed",
              !isDisabled && "cursor-pointer"
            )}
          >
            <input
              type="checkbox"
              value={party.abbreviation}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled}
              checked={isSelected}
              onChange={() => {
                if (isSelected) {
                  setSelectedParties(
                    selectedParties.filter(
                      (selectedParty) => selectedParty !== party.abbreviation
                    )
                  );
                } else {
                  setSelectedParties([...selectedParties, party.abbreviation]);
                }
              }}
            />
            <span>{party.abbreviation}</span>
          </motion.label>
        );
      })}
    </aside>
  );
};
