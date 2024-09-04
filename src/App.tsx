import { useEffect, useState } from "react";
import { WahlkabineElectionWrapperMinimal } from "./wahlkabine-data/types";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Blend } from "lucide-react";
import clsx from "clsx";
import { Details } from "./components/details";
import { AnswersPerPartyPage } from "./pages/answers-per-party-page";
import { AnswersPerQuestionPage } from "./pages/answers-per-question-page";
import { VennPage } from "./pages/venn-page";

import "./index.css";

function App() {
  const [data, setData] = useState<WahlkabineElectionWrapperMinimal[] | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);
  const isLoading = !data && !error;
  const isError = !!error;

  const [selectedElectionId, setSelectedElectionId] = useLocalStorage<
    string | null
  >("selected-election-id", data?.[0]?._id);

  const selectedElection = data?.find(
    (election) => election._id === selectedElectionId
  );

  const [selectedPartyId, setSelectedPartyId] = useLocalStorage<string | null>(
    "selected-party-id",
    null
  );

  const parties = selectedElection?.election.parties;

  const selectedParty = parties?.find((party) => party._id === selectedPartyId);

  const selectedPartyIdx =
    parties?.findIndex((party) => party._id === selectedPartyId) ?? 0;

  const previousParty =
    parties?.find((party, idx) => idx === selectedPartyIdx - 1) ??
    parties?.[parties.length - 1] ??
    null;

  const nextParty =
    parties?.find((party, idx) => idx === selectedPartyIdx + 1) ??
    parties?.[0] ??
    null;

  const [selectedQuestionIdx, setSelectedQuestionIdx] = useLocalStorage<
    number | null
  >("selected-question-index", null);

  const selectedQuestion =
    selectedQuestionIdx !== null
      ? selectedElection?.election.questions?.at(selectedQuestionIdx)
      : null;

  useEffect(() => {
    fetch("/data-minimal.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, [selectedElectionId, setSelectedElectionId]);

  const vennActive = selectedElection && !selectedParty && !selectedQuestion;
  const questionActive = selectedElection && !selectedParty && selectedQuestion;
  const partyActive = selectedElection && selectedParty && !selectedQuestion;

  return (
    <div className="max-w-full flex flex-col lg:flex-row bg-lightBeige">
      <header className="flex flex-col pt-0 w-full lg:w-[300px] xl:w-[350px] xxl:w-[400px] flex-shrink-0 max-w-full lg:max-h-full lg:h-[100vh]  lg:border-r border-black">
        <SocialBar className="lg:hidden" />

        <div className="border-b border-black lg:sticky top-0 bg-lightBeige w-full px-5 py-5 flex flex-col gap-4 items-end">
          <a href="https://momentum-institut.at" target="_blank" rel="noopener">
            <img
              src="/momentum-institut-logo.png"
              width={1700}
              height={441}
              alt="Momentum Institut"
              className="w-full max-w-[350px]"
            />
          </a>
          <span className="py-1 px-2 bg-black selection:bg-violet select-none text-white font-bold text-lg lg:text-base rounded-sm">
            Koalitions-Kompass
          </span>
        </div>

        <div className="flex flex-col gap-1 px-4 lg:border-b border-black py-5">
          <label htmlFor="election" className="font-semibold">
            Wahl auswählen:
          </label>
          <select
            value={selectedElectionId ?? data?.[0]?._id}
            onChange={(event) => setSelectedElectionId(event.target.value)}
            className="w-full"
            id="election"
            name="election"
          >
            {!data && <option>Loading...</option>}
            {data?.map((election) => (
              <option
                value={election._id}
                key={`election-select-${election._id}`}
              >
                {election.title}
              </option>
            ))}
          </select>
        </div>
        {selectedElection && (
          <div
            className={clsx(
              "lg:flex-col flex [--overflow-shadow-bg:var(--tw-lightBeige)] lg:gap-3 flex-row overflow-shadow-vertical flex-grow lg:px-4 lg:py-5  lg:overflow-y-auto scrollbar-thumb-black scrollbar-track-lightBeige scrollbar-thin border-b border-black lg:border-b-0 gap-0 ",
              vennActive &&
                "border-b-[1rem] border-peach shadow-sm shadow-peach md:shadow-none",
              questionActive &&
                "border-b-[1rem] border-green  shadow-sm shadow-green md:shadow-none",
              partyActive &&
                "border-b-[1rem] border-violet  shadow-sm shadow-violet md:shadow-none"
            )}
          >
            <button
              data-active={vennActive}
              className={clsx(
                "border-peach border-l-4 hidden lg:flex notouch:hover:bg-peach transition-all focus-visible:bg-peach px-2 py-2 text-lg lg:text-xl xl:text-2xl flex-row gap-2 items-center justify-between font-semibold data-[active=true]:bg-peach data-[active=true]:text-white notouch:hover:text-white focus-visible:text-white"
              )}
              onClick={() => {
                setSelectedQuestionIdx(null);
                setSelectedPartyId(null);
              }}
            >
              Venn Diagramm
              <Blend className="w-5 h-5 mx-2" />
            </button>

            <button
              data-active={vennActive}
              onClick={() => {
                if (!parties || parties.length === 0) {
                  return;
                }

                setSelectedQuestionIdx(null);
                setSelectedPartyId(null);
              }}
              className="notouch:hover:bg-peach text-center flex-1 py-3 block lg:hidden px-2 focus-visible:bg-peach w-full data-[active=true]:bg-peach bg-peach/40 font-bold data-[active=true]:text-white notouch:hover:text-white focus-visible:text-white"
            >
              <span>Venn</span>
            </button>

            <button
              data-active={partyActive}
              onClick={() => {
                if (!parties || parties.length === 0) {
                  return;
                }

                setSelectedQuestionIdx(null);
                setSelectedPartyId(parties[0]._id);
              }}
              className="notouch:hover:bg-peach text-center flex-1 py-3 block lg:hidden px-2 focus-visible:bg-peach w-full data-[active=true]:bg-violet bg-violet/40 font-bold data-[active=true]:text-white notouch:hover:text-white focus-visible:text-white"
            >
              <span>Parteien</span>
            </button>

            <button
              data-active={!!questionActive}
              onClick={() => {
                if (!selectedElection?.election.questions.length) {
                  return;
                }

                setSelectedQuestionIdx(0);
                setSelectedPartyId(null);
              }}
              className="notouch:hover:bg-peach text-center flex-1 py-3 block lg:hidden px-2 focus-visible:bg-peach w-full data-[active=true]:bg-green bg-green/40 font-bold data-[active=true]:text-white notouch:hover:text-white focus-visible:text-white"
            >
              <span>Fragen</span>
            </button>

            <div className="flex-shrink-0 w-full gap-4 hidden lg:flex flex-col">
              <Details
                className="[--details-color:var(--tw-violet)]"
                defaultOpen={false}
                summary={
                  <div className="text-lg lg:text-xl xl:text-2xl py-1">
                    Parteien ({selectedElection.election.parties.length})
                  </div>
                }
              >
                <ul className="flex flex-col list-none p-0 ">
                  {selectedElection.election.parties.map((party) => (
                    <li key={`party-list-${party.abbreviation}`}>
                      <button
                        data-active={party._id === selectedPartyId}
                        className="notouch:hover:bg-violet py-3 px-2 focus-visible:bg-violet w-full text-left transition-all data-[active=true]:bg-violet data-[active=true]:text-white notouch:hover:text-white focus-visible:text-white"
                        onClick={() => {
                          setSelectedPartyId(party._id);
                          setSelectedQuestionIdx(null);
                        }}
                      >
                        {party.abbreviation} – {party.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </Details>
              <Details
                className="[--details-color:var(--tw-green)]"
                summary={
                  <div className="text-lg lg:text-xl xl:text-2xl py-1">
                    Fragen ({selectedElection.election.questions.length})
                  </div>
                }
              >
                <ul className="flex flex-col list-none p-0">
                  {selectedElection.election.questions.map((question, idx) => (
                    <li
                      key={`election-${selectedElection._id}-question-${idx}`}
                    >
                      <button
                        data-active={idx === selectedQuestionIdx}
                        className="notouch:hover:bg-green py-3 px-2 focus-visible:bg-green w-full text-left transition-all data-[active=true]:bg-green data-[active=true]:text-white notouch:hover:text-white focus-visible:text-white"
                        onClick={() => {
                          setSelectedQuestionIdx(idx);
                          setSelectedPartyId(null);
                        }}
                      >
                        {question.topics && (
                          <div className="list-none flex flex-row gap-1 flex-wrap text-xs">
                            {question.topics.join(", ")}
                          </div>
                        )}
                        <div
                          dangerouslySetInnerHTML={{ __html: question.text }}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </Details>
            </div>
          </div>
        )}

        <SocialBar className="hidden lg:flex" />

        <Credits className="hidden lg:block" />
      </header>

      <div className="flex flex-grow flex-col items-stretch gap-10 lg:max-h-full w-full lg:h-[100vh] lg:overflow-y-auto scrollbar-thumb-peach scrollbar-track-white scrollbar-thin ">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error: {error.message}</p>}

        {vennActive ? <VennPage election={selectedElection} /> : null}

        {partyActive && (
          <AnswersPerPartyPage
            party={selectedParty}
            election={selectedElection}
            previousParty={previousParty}
            nextParty={nextParty}
            setPartyId={(partyId) => {
              setSelectedPartyId(partyId);
            }}
          />
        )}

        {questionActive && (
          <AnswersPerQuestionPage
            hasPreviousQuestion={selectedQuestionIdx !== 0}
            hasNextQuestion={
              selectedQuestionIdx !==
              selectedElection.election.questions.length - 1
            }
            goToPreviousQuestion={() => {
              if (
                selectedQuestionIdx === undefined ||
                selectedQuestionIdx === null
              ) {
                return;
              }

              if (selectedQuestionIdx === 0) {
                return;
              }

              setSelectedQuestionIdx(selectedQuestionIdx - 1);
            }}
            goToNextQuestion={() => {
              if (
                selectedQuestionIdx === undefined ||
                selectedQuestionIdx === null
              ) {
                return;
              }

              if (
                selectedQuestionIdx ===
                selectedElection.election.questions.length - 1
              ) {
                return;
              }

              setSelectedQuestionIdx(selectedQuestionIdx + 1);
            }}
            selectedQuestion={selectedQuestion}
            election={selectedElection}
          />
        )}
      </div>

      <footer className="lg:hidden">
        <SocialBar className="border-b-0 border-t" />
        <Credits />
      </footer>
    </div>
  );
}

export default App;

const Credits = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        "px-4 py-5 text-center bg-lightBeige border-t border-black text-gray-700",
        className
      )}
    >
      <p>
        basiert auf Daten von{" "}
        <a
          className="underline font-semibold"
          href="https://wahlkabine.at"
          target="_blank"
          rel="noopener"
        >
          wahlkabine.at
        </a>
      </p>
      <p>
        entwickelt von{" "}
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
      </p>
      <p>
        Code sowie Daten sind{" "}
        <a
          className="underline font-semibold"
          href="https://github.com/madebyarthouse/momentum-coalition-compass"
          target="_blank"
          rel="noopener"
        >
          open-source
        </a>{" "}
      </p>
    </div>
  );
};

const SocialBar = ({ className }: { className?: string }) => {
  return (
    <ul
      className={clsx(
        "flex flex-row gap-3 border-b lg:border-b-0 lg:border-t border-black px-4 items-center justify-center py-4",
        className
      )}
    >
      <li>
        <a
          href="https://mastodon.social/@mom_inst@social.moment.at"
          target="_blank"
        >
          <img
            width="24"
            height="24"
            src="https://www.momentum-institut.at/wp-content/themes/moi/assets/img/icons/footer-mastodon-black.svg"
            alt="mastodon"
          />
        </a>
      </li>
      <li>
        <a href="https://x.com/mom_inst" target="_blank">
          <img
            width="24"
            height="24"
            src="https://www.momentum-institut.at/wp-content/themes/moi/assets/img/icons/footer-x-black.svg"
            alt="x"
          />
        </a>
      </li>
      <li>
        <a href="https://www.instagram.com/moment_magazin/" target="_blank">
          <img
            width="24"
            height="24"
            src="https://www.momentum-institut.at/wp-content/themes/moi/assets/img/icons/footer-instagram-black.svg"
            alt="instagram"
          />
        </a>
      </li>
      <li>
        <a href="https://www.facebook.com/momentuminstitut" target="_blank">
          <img
            width="24"
            height="24"
            src="https://www.momentum-institut.at/wp-content/themes/moi/assets/img/icons/footer-facebook-black.svg"
            alt="facebook"
          />
        </a>
      </li>
      <li>
        <a
          href="https://at.linkedin.com/company/momentum-institut"
          target="_blank"
        >
          <img
            width="24"
            height="24"
            src="https://www.momentum-institut.at/wp-content/themes/moi/assets/img/icons/footer-linkedin-black.svg"
            alt="linkedin"
          />
        </a>
      </li>
      <li>
        <a href="https://www.threads.net/@moment_magazin?hl=de" target="_blank">
          <img
            width="24"
            height="24"
            src="https://www.momentum-institut.at/wp-content/themes/moi/assets/img/icons/footer-threads-black.svg"
            alt="threads"
          />
        </a>
      </li>
    </ul>
  );
};
