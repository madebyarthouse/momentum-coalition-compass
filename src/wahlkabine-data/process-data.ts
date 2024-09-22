import { load } from "cheerio";
import { WahlkabineElection, WahlkabineElectionWrapperMinimal } from "./types";

(async () => {
  console.log("Processing data from data.json...");
  const rawDataFile = Bun.file("./src/wahlkabine-data/data.json");
  const rawData = await rawDataFile.text();

  const data = JSON.parse(rawData) as WahlkabineElection[];

  const cleanedData: WahlkabineElectionWrapperMinimal[] = data.map(
    (election) => {
      return {
        ...election,
        election: {
          ...election.election,
          questions: election.election.questions.map((question) => ({
            ...question,
            text: getTextFromHtml(question.text),
            answers: question.answers.map((answer) => ({
              ...answer,
              party_abbreviation: election.election.parties.find(
                (party) => party._id === answer.party_id
              )?.abbreviation,
            })),
          })),
          editorialTeam: undefined,
          partners: undefined,
        },
        content: undefined,
        cutContent: undefined,
      };
    }
  );

  const latestElectionData = cleanedData.slice(0, 1);

  console.log("Writing data-minimal.json...");
  await Bun.write(
    "./src/wahlkabine-data/data-minimal.json",
    JSON.stringify(cleanedData)
  );

  console.log("Writing data-minimal-latest.json...");
  await Bun.write(
    "./src/wahlkabine-data/data-minimal-latest.json",
    JSON.stringify(latestElectionData)
  );
})();

const getTextFromHtml = (html: string) => {
  const $ = load(html);

  return (
    $.text()
      .replaceAll("\n", "")
      .replace(/<!--.*?-->/g, "") || ""
  );
};
