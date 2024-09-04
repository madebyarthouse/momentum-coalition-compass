import { WahlkabineElection } from "./types";

(async () => {
  const rawDataFile = Bun.file("./data.json");
  const rawData = await rawDataFile.text();

  const data = JSON.parse(rawData) as WahlkabineElection[];

  const parties: Record<string, (typeof data)[number]["election"]["parties"]> =
    {};

  for (const election of data) {
    for (const party of election.election.parties) {
      if (!parties[party.abbreviation]) {
        parties[party.abbreviation] = [];
      }
      parties[party.abbreviation].push(party);
    }
  }

  // console.log(parties)

  const topics: Record<string, Record<string, number>> = {};

  for (const election of data) {
    if (!topics[election.title]) {
      topics[election.title] = {};
    }

    for (const question of election.election.questions) {
      if (!question.topics) continue;

      for (const topic of question.topics) {
        if (!topics[election.title]?.[topic]) {
          topics[election.title][topic] = 0;
        }

        topics[election.title][topic]++;
      }
    }
  }

  const totalsPerTopic = Object.values(topics).reduce((acc, cur) => {
    Object.entries(cur).forEach(([key, value]) => {
      acc[key] = (acc[key] || 0) + value;
    });

    return acc;
  }, {} as Record<string, number>);

  console.log(topics, totalsPerTopic);
})();
