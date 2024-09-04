import { useCallback } from "react";
import { Details } from "../components/details";
import {
  Question,
  WahlkabineElectionWrapperMinimal,
} from "../wahlkabine-data/types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";

export const AnswersPerQuestionPage = ({
  selectedQuestion,
  election,
  hasPreviousQuestion,
  hasNextQuestion,
  goToPreviousQuestion,
  goToNextQuestion,
}: {
  selectedQuestion: Question;
  election: WahlkabineElectionWrapperMinimal;
  hasPreviousQuestion: boolean;
  hasNextQuestion: boolean;
  goToPreviousQuestion: () => void;
  goToNextQuestion: () => void;
}) => {
  const partyForId = useCallback(
    (partyId: string) => {
      return election?.election.parties.find((party) => party._id === partyId);
    },
    [election]
  );

  return (
    <div className="w-[1000px] xxl:w-[1200px] max-w-full pb-10">
      <section className="flex flex-col gap-10">
        <div className="border-b bg-lightBeige border-black px-3 md:px-5 lg:px-10 xl:px-14 xxl:px-16 py-10 flex flex-col gap-4">
          <header className="flex flex-row gap-4">
            <button
              disabled={!hasPreviousQuestion}
              onClick={goToPreviousQuestion}
              className="text-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer notouch:hover:bg-black disabled:notouch:hover:bg-transparent disabled:notouch:hover:text-black disabled:focus-visible:bg-transparent disabled:focus-visible:text-black transition-all focus-visible:bg-black px-2 border-black border text-black py-1 flex flex-row gap-2 items-center justify-between font-semibold data-[active=true]:bg-black data-[active=true]:text-white notouch:hover:text-white focus-visible:text-white"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Vorherige Frage</span>
            </button>
            <button
              disabled={!hasNextQuestion}
              onClick={goToNextQuestion}
              className="text-sm disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer notouch:hover:bg-black transition-all focus-visible:bg-black px-2 border-black border text-black py-1 flex flex-row gap-2 items-center justify-between font-semibold data-[active=true]:bg-black data-[active=true]:text-white notouch:hover:text-white focus-visible:text-white"
            >
              <span>Nächste Frage</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </header>
          <h1
            className="text-3xl font-bold"
            dangerouslySetInnerHTML={{ __html: selectedQuestion.text }}
          />
          <p>{selectedQuestion.topics?.join(", ")}</p>
        </div>

        <div className="flex flex-col gap-6 px-3 md:px-5 lg:px-10 xl:px-14 xxl:px-16">
          <h2 className="text-4xl font-semibold">Antworten der Parteien</h2>
          <ul className="flex flex-col gap-5">
            {selectedQuestion.answers.map((answer) => (
              <li className="flex flex-col gap-2" key={answer.party_id}>
                <Details
                  className="[--details-color:var(--tw-green)]"
                  iconSize={28}
                  summary={
                    <div className="flex flex-col gap-1 md:px-4 px-2 py-2">
                      <div className="flex text-lg items-center gap-1">
                        {answer.consent === 1 ? (
                          <ThumbsUpIcon className="w-6 h-6" />
                        ) : (
                          <ThumbsDownIcon className="w-6 h-6" />
                        )}
                        <span className="font-semibold text-lg">
                          {answer.consent === 1
                            ? "Stimme zu"
                            : "Stimme nicht zu"}
                        </span>
                      </div>
                      <span className="text-xl font-semibold">
                        {partyForId(answer.party_id)?.name} (
                        {partyForId(answer.party_id)?.abbreviation})
                      </span>
                    </div>
                  }
                >
                  {answer.comment && (
                    <p className="prose pl-5 py-3">{answer.comment}</p>
                  )}
                </Details>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
