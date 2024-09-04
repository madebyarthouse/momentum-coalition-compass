import { useCallback, useId, useMemo } from "react";
import { WahlkabineElectionWrapperMinimal } from "../wahlkabine-data/types";
import { ChartVenn } from "./venn-diagramm";
import { useLocalStorage } from "@uidotdev/usehooks";
import clsx from "clsx";
import { Details } from "./details";
import { PartiesFilter } from "./parties-filter";
import { buildElectionVennData } from "../utils";

export const ElectionVennController = ({
  election,
  defaultSelectedParties,
  filteredParties,
  showEmbedCode = false,
  sourcePath = "",
  breakPoint = "laptop",
  filteredTopics,
  showCredits = true,
  resetToDefault = false,
}: {
  election: WahlkabineElectionWrapperMinimal;
  defaultSelectedParties?: string[];
  showEmbedCode?: boolean;
  sourcePath?: string;
  breakPoint?: "laptop" | "tablet";
  padding?: "none" | "large";
  filteredTopics?: string[];
  filteredParties?: string[];
  showCredits?: boolean;
  resetToDefault?: boolean;
}) => {
  const id = useId();
  const parties = filteredParties
    ? election?.election.parties.filter((party) =>
        filteredParties.includes(party._id)
      )
    : election?.election.parties;
  const randomParties = parties
    .map((party) => party._id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const [selectedParties, setSelectedParties] = useLocalStorage<string[]>(
    `selected-parties-${id}-${election._id}-${filteredParties?.join("-")}`,
    defaultSelectedParties ?? randomParties ?? []
  );

  const filteredSelectedParties = filteredParties
    ? selectedParties.filter((party) => filteredParties.includes(party))
    : selectedParties;

  const partyForId = useCallback(
    (partyId: string) => {
      return election?.election.parties.find((party) => party._id === partyId);
    },
    [election]
  );

  const vennData = useMemo(() => {
    return buildElectionVennData({
      partyForId,
      filteredSelectedParties,
      election,
      filteredTopics,
    });
  }, [election, filteredSelectedParties, partyForId, filteredTopics]);

  const defaultPartiesAreSelected = defaultSelectedParties
    ? selectedParties.every((party) => defaultSelectedParties.includes(party))
    : true;

  const hasTopics = filteredTopics === undefined || filteredTopics.length > 0;

  return (
    <div
      className={clsx(
        "flex flex-col gap-8 max-w-full w-[1000px] mx-auto text-base twp",
        breakPoint === "tablet" && "lg:w-[1200px]",
        breakPoint === "laptop" && "xl:w-[1200px]"
      )}
    >
      {filteredSelectedParties.length === 0 ? (
        <p className="flex items-center min-h-[350px] md:min-h-[500px] justify-center h-full w-full font-semibold">
          Bitte wähle mindestens 1 Partei aus.
        </p>
      ) : null}

      {!hasTopics ? (
        <p className="flex items-center min-h-[350px] md:min-h-[500px] justify-center h-full w-full font-semibold">
          Bitte wähle mindestens 1 Thema aus.
        </p>
      ) : null}

      {filteredSelectedParties.length > 0 && hasTopics ? (
        <ChartVenn
          data={vennData.rows}
          label={`${election?.title}`}
          bgColors={vennData.bgColors}
          logoPath={`${sourcePath}/momentum-institut-logo.png`}
          breakPoint={breakPoint}
          matchingScore={vennData.matchingScore}
        />
      ) : null}

      <PartiesFilter
        parties={
          filteredParties
            ? election?.election.parties.filter((party) =>
                filteredParties.includes(party._id)
              )
            : election?.election.parties
        }
        selectedParties={filteredSelectedParties}
        setSelectedParties={setSelectedParties}
        maxSelected={4}
      />

      {defaultSelectedParties &&
      resetToDefault &&
      !defaultPartiesAreSelected ? (
        <div className="flex">
          <button
            className="text-sm px-1 py-1 rounded-md border-black border notouch:hover:bg-black transition-all focus-visible:bg-black notouch:hover:text-white focus-visible:text-white"
            onClick={() => setSelectedParties(defaultSelectedParties)}
          >
            reset
          </button>
        </div>
      ) : null}

      {showCredits && (
        <div className=" max-w-[700px] w-full flex flex-col gap-2">
          <p className="text-sm italic text-gray-600">
            Hinweis: bei machen Koalitionsvarianten kann es technisch bedingt zu
            kleineren Darstellungsfehlern kommen. Danke für das Verständnis.
          </p>
          <p>
            Entwickelt in Kooperation mit{" "}
            <a
              className="underline font-semibold"
              href="https://chrcit.com"
              target="_blank"
              rel="noopener"
            >
              Christian Cito
            </a>{" "}
            /{" "}
            <a
              className="underline font-semibold"
              href="https://madebyarthouse.com"
              target="_blank"
              rel="noopener"
            >
              Arthouse
            </a>{" "}
            auf Basis von Daten von{" "}
            <a
              className="underline font-semibold"
              href="https://wahlkabine.at"
              target="_blank"
              rel="noopener"
            >
              wahlkabine.at
            </a>
            .
            <br />
            Code sowie Daten sind{" "}
            <a
              className="underline font-semibold"
              href="https://github.com/madebyarthouse/momentum-election-compass"
              target="_blank"
              rel="noopener"
            >
              open-source
            </a>
            .
          </p>
        </div>
      )}

      {showEmbedCode && (
        <Details
          summary="Embed"
          className="max-w-[700px] w-full"
          defaultOpen={false}
        >
          <code className="text-sm w-full  max-h-[400px]">
            <pre className="overflow-auto whitespace-pre bg-white p-5">
              {`
  <link rel="stylesheet" href="https://momentum-coalition-compass.pages.dev/styles.css" />
  <div id="election-venn" class="py-8 md:py-10 px-2 md:px-5 lg:px-10 twp"></div>
  <script src="https://momentum-coalition-compass.pages.dev/momentum-venn.js"></script>

  <script>
    /* prettier-ignore */
    const election = ${JSON.stringify(removeCommentsFromElection(election))};
    const defaultSelectedParties = ${JSON.stringify(filteredSelectedParties)};

    window.hydrateElectionVennController({
      election: election,
      /* defaultSelectedParties: defaultSelectedParties, */
      sourcePath: "https://momentum-coalition-compass.pages.dev",
      breakPoint: "tablet",
      /* defaultSelectedParties: defaultSelectedParties, */
      /* resetToDefault = true, */
    });
  </script>`}
            </pre>
          </code>
        </Details>
      )}
    </div>
  );
};

const removeCommentsFromElection = (
  election: WahlkabineElectionWrapperMinimal
) => {
  return {
    ...election,
    election: {
      ...election.election,
      questions: election.election.questions.map((question) => ({
        ...question,
        answers: question.answers.map((answer) => ({
          ...answer,
          comment: undefined,
        })),
      })),
    },
  };
};
