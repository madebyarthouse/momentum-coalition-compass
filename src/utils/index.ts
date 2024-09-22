import { WahlkabineElectionWrapperMinimal } from "../wahlkabine-data/types";
import { generateColorCombinations } from "./colors";
import { getPartyColorByAbbreviation } from "./partiesWithColors";

export const htmlStringToText = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent?.replaceAll("\n", "").replace(/<!--.*?-->/g, "") || "";
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const getRandomString = (arr: string[], size: number): string[] => {
  return arr.sort(() => Math.random() - 0.5).slice(0, size);
};

export const buildElectionVennData = ({
  partyForAbbreviation,
  filteredSelectedParties,
  election,
  filteredTopics,
}: {
  partyForAbbreviation: (
    partyAbbreviation: string
  ) =>
    | WahlkabineElectionWrapperMinimal["election"]["parties"][number]
    | undefined;
  filteredSelectedParties: string[];
  election: WahlkabineElectionWrapperMinimal;
  filteredTopics?: string[];
}) => {
  if (!election || !filteredSelectedParties.length) {
    // little hack to prevent type error cause TS is not smart enough
    return { rows: [], bgColors: [], matchingScore: 0 };
  }

  const rows: {
    label: string;
    values: string[];
  }[] = election.election.parties
    .filter((party) => {
      return filteredSelectedParties.includes(party.abbreviation);
    })
    .map((party) => ({
      label: `${party.abbreviation}`,
      values: [],
    }));

  election.election.questions.forEach((question) => {
    question.answers.forEach((answer) => {
      const partyForAnswer = partyForAbbreviation(answer.party_abbreviation);

      if (!partyForAnswer) {
        return;
      }

      const questionHasNoTopics =
        !question.topics || question.topics.length === 0;

      if (filteredTopics) {
        const noTopicOptionSelected = filteredTopics.includes("Kein Thema");
        const noMatchForTopic = question.topics?.every(
          (topic) => !filteredTopics.includes(topic)
        );

        if (noMatchForTopic) {
          if (!questionHasNoTopics || !noTopicOptionSelected) {
            return;
          }
        }
      }

      const partyRow = rows.find(
        (row) => row.label === `${partyForAnswer.abbreviation}`
      );

      if (partyRow) {
        partyRow.values.push(`${answer.consent} – ${question.text}`);
      }
    });
  });

  const bgColors = generateColorCombinations(
    rows.map((row) => getPartyColorByAbbreviation(row.label))
  );

  const rowForAllPartyMatch = Object.entries(
    rows.reduce((acc, row) => {
      row.values.forEach((value) => {
        if (!acc[value]) {
          acc[value] = 0;
        }
        acc[value]++;
      });

      return acc;
    }, {} as Record<string, number>)
  ).filter(([, count]) => count === rows.length).length;

  return {
    rows,
    bgColors,
    matchingScore: rowForAllPartyMatch,
  };
};

export const getTopics = (election: WahlkabineElectionWrapperMinimal) => {
  return election?.election.questions.reduce((acc, question) => {
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
};
