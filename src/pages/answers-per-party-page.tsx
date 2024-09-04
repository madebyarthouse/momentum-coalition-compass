import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Details } from "../components/details";
import {
  Answer,
  Party,
  Question,
  WahlkabineElectionWrapperMinimal,
} from "../wahlkabine-data/types";

export const AnswersPerPartyPage = ({
  party,
  election,
  previousParty,
  nextParty,
  setPartyId,
}: {
  party: Party;
  election: WahlkabineElectionWrapperMinimal;
  previousParty: Party | null;
  nextParty: Party | null;
  setPartyId: (partyId: string) => void;
}) => {
  const selectedPartyQuestions = election?.election.questions.reduce(
    (acc, question) => {
      const answers = question.answers.filter(
        (answer) => answer.party_id === party._id
      );

      if (answers.length > 0) {
        acc.push({
          ...question,
          answer: answers[0],
        });
      }

      return acc;
    },
    [] as Array<Question & { answer: Answer }>
  );

  return (
    <div className="w-[1000px] xxl:w-[1200px] max-w-full">
      <section>
        <header className="border-b border-black px-3 md:px-5 lg:px-10 xl:px-14 xxl:px-16 py-10 flex flex-col gap-4">
          <aside className="flex flex-row gap-4">
            <button
              disabled={!previousParty}
              onClick={() => {
                if (!previousParty) {
                  return;
                }
                setPartyId(previousParty?._id);
              }}
              className="text-sm disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer notouch:hover:bg-black transition-all focus-visible:bg-black px-2 border-black border text-black py-1 flex flex-row gap-2 items-center justify-between font-semibold data-[active=true]:bg-black data-[active=true]:text-white notouch:hover:text-white focus-visible:text-white"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>{previousParty?.abbreviation ?? ""}</span>
            </button>
            <button
              disabled={!nextParty}
              onClick={() => {
                if (!nextParty) {
                  return;
                }
                setPartyId(nextParty?._id);
              }}
              className="text-sm disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer notouch:hover:bg-black transition-all focus-visible:bg-black px-2 border-black border text-black py-1 flex flex-row gap-2 items-center justify-between font-semibold data-[active=true]:bg-black data-[active=true]:text-white notouch:hover:text-white focus-visible:text-white"
            >
              <span>{nextParty?.abbreviation ?? ""}</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </aside>
          <h1 className="text-4xl font-bold">
            {party.abbreviation} – {party.name}
          </h1>

          <a
            href={party.homepage}
            className="underline font-semibold"
            target="_blank"
            rel="noopener"
          >
            Webseite
          </a>
        </header>

        <div className="flex flex-col gap-4 px-3 md:px-5 lg:px-10 xl:px-14 xxl:px-16 py-10">
          <h2 className="text-3xl font-semibold">Fragen</h2>
          <ul className="flex flex-col gap-5">
            {selectedPartyQuestions?.map((question) => (
              <li className="flex flex-col gap-2" key={question.text}>
                <Details
                  className="[--details-color:var(--tw-violet)]"
                  iconSize={28}
                  summary={
                    <div className="md:px-4 px-2 flex flex-col gap-2 py-2">
                      <div className="flex text-lg items-center gap-1">
                        {question.answer.consent === 1 ? (
                          <ThumbsUpIcon className="w-6 h-6" />
                        ) : (
                          <ThumbsDownIcon className="w-6 h-6" />
                        )}
                        <span className="font-semibold text-lg">
                          {question.answer.consent === 1
                            ? "Stimme zu"
                            : "Stimme nicht zu"}
                        </span>
                      </div>
                      <h3
                        className="text-xl font-semibold mt-0"
                        dangerouslySetInnerHTML={{
                          __html: question.text,
                        }}
                      />
                    </div>
                  }
                >
                  {question.answer.comment ? (
                    <p className="prose pl-5 py-3">{question.answer.comment}</p>
                  ) : null}
                </Details>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
