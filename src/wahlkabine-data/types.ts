export interface WahlkabineElectionWrapperMinimal {
  _id: string;
  title: string;
  urlSegment: string;
  publicationDate: string;
  election: WahlkabineElectionMinimal;
}

export type WahlkabineElectionMinimal = Omit<
  Election,
  "editorialTeam" | "partners"
>;

export interface WahlkabineElection {
  _id: string;
  title: string;
  urlSegment: string;
  publicationDate: string;
  election: Election;
  content: string;
  cutContent?: boolean;
}

export interface Election {
  electionRegion?: string;
  electionType: string;
  electionDate: string;
  parties: Party[];
  questions: Question[];
  editorialTeam: EditorialTeam[];
  partners?: Partner[];
  methodology?: string;
  compactOverview?: string;
  mediaInformation?: string;
  officialResult?: string;
  rejectedQuestions: never;
}

export interface Party {
  _id: string;
  abbreviation: string;
  homepage?: string;
  name: string;
}

export interface Question {
  answers: Answer[];
  topics?: string[];
  text: string;
}

export interface Answer {
  party_id: string;
  consent: number;
  weight: number;
  comment?: string;
}

export interface EditorialTeam {
  name: string;
  institute: string;
}

export interface Partner {
  logo: string;
  homepage: string;
  name: string;
}
