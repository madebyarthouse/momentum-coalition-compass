export const partiesWithColors = [
  {
    abbreviation: "SPÖ",
    rgba: "rgba(219, 9, 21, 1)", // Red
  },
  {
    abbreviation: "FPÖ",
    rgba: "rgba(0, 94, 168, 1)", // Blue
  },
  {
    abbreviation: "GRÜNE",
    rgba: "rgba(135, 181, 43, 1)", // Green
  },
  {
    abbreviation: "ÖVP",
    rgba: "rgba(97, 195, 208, 1)", // Turquoise
  },
  {
    abbreviation: "NEOS",
    rgba: "rgba(203, 26, 103, 1)", // Pink
  },
  {
    abbreviation: "HC",
    rgba: "rgba(255, 165, 0, 1)", // Orange
  },
  {
    abbreviation: "LINKS",
    rgba: "rgba(93, 10, 163, 1)", // Purple
  },
  {
    abbreviation: "BIER",
    labelColor: "rgba(0,0,0,1)",
    rgba: "rgba(255, 237, 1, 1)", // Goldenrod
  },
  {
    abbreviation: "SÖZ",
    rgba: "rgba(30, 144, 255, 1)", // DodgerBlue
  },
  {
    abbreviation: "VOLT",
    rgba: "rgba(102, 44, 145, 1)", // Dark Purple
  },
  {
    abbreviation: "JETZT",
    rgba: "rgba(7, 1, 1, 1)", // OrangeRed
  },
  {
    abbreviation: "KPÖ",
    rgba: "rgba(217, 19, 223, 1)", // Deep Red
  },
  {
    abbreviation: "WANDL",
    rgba: "rgba(226, 33, 28, 1)", // Dark Red
  },
  {
    abbreviation: "EUROPA",
    rgba: "rgba(255, 215, 0, 1)", // Gold
  },
  {
    abbreviation: "PILZ",
    rgba: "rgba(75, 0, 130, 1)", // Indigo
  },
  {
    abbreviation: "FLÖ",
    rgba: "rgba(255, 99, 71, 1)", // Tomato
  },
  {
    abbreviation: "ANDAS",
    rgba: "rgba(70, 130, 180, 1)", // SteelBlue
  },
  {
    abbreviation: "AG",
    rgba: "rgba(0, 255, 0, 1)", // Lime
  },
  {
    abbreviation: "GRAS",
    rgba: "rgba(50, 205, 50, 1)", // LimeGreen
  },
  {
    abbreviation: "VSSTÖ",
    rgba: "rgba(255, 20, 147, 1)", // DeepPink
  },
  {
    abbreviation: "JUNOS",
    rgba: "rgba(255, 192, 203, 1)", // Pink
  },
  {
    abbreviation: "RFS",
    rgba: "rgba(65, 105, 225, 1)", // RoyalBlue
  },
  {
    abbreviation: "KSV",
    rgba: "rgba(178, 34, 34, 1)", // FireBrick
  },
  {
    abbreviation: "KSV-LILI",
    rgba: "rgba(233, 150, 122, 1)", // DarkSalmon
  },
  {
    abbreviation: "FEST",
    rgba: "rgba(32, 178, 170, 1)", // LightSeaGreen
  },
  {
    abbreviation: "BZÖ",
    rgba: "rgba(255, 160, 122, 1)", // LightSalmon
  },
  {
    abbreviation: "ANDERS",
    rgba: "rgba(127, 255, 0, 1)", // Chartreuse
  },
  {
    abbreviation: "FRANK",
    rgba: "rgba(186, 85, 211, 1)", // MediumOrchid
  },
  {
    abbreviation: "NEOS/LIF",
    rgba: "rgba(255, 105, 180, 1)", // HotPink
  },
  {
    abbreviation: "PIRAT",
    rgba: "rgba(30, 144, 255, 1)", // DodgerBlue
  },
  {
    abbreviation: "JULIS",
    rgba: "rgba(0, 191, 255, 1)", // DeepSkyBlue
  },
  {
    abbreviation: "KSV-KJÖ",
    rgba: "rgba(210, 105, 30, 1)", // Chocolate
  },
  {
    abbreviation: "VP TIROL",
    rgba: "rgba(0, 0, 139, 1)", // DarkBlue
  },
  {
    abbreviation: "FRITZ",
    rgba: "rgba(85, 107, 47, 1)", // DarkOliveGreen
  },
  {
    abbreviation: "GURGISER",
    rgba: "rgba(139, 69, 19, 1)", // SaddleBrown
  },
  {
    abbreviation: "VORWÄRTS",
    rgba: "rgba(47, 79, 79, 1)", // DarkSlateGray
  },
  {
    abbreviation: "FPK",
    rgba: "rgba(70, 130, 180, 1)", // SteelBlue
  },
  {
    abbreviation: "ASOK",
    rgba: "rgba(255, 140, 0, 1)", // DarkOrange
  },
  {
    abbreviation: "LBL",
    rgba: "rgba(0, 206, 209, 1)", // DarkTurquoise
  },
  {
    abbreviation: "MARTIN",
    rgba: "rgba(123, 104, 238, 1)", // MediumSlateBlue
  },
  {
    abbreviation: "LIF",
    rgba: "rgba(0, 250, 154, 1)", // MediumSpringGreen
  },
  {
    abbreviation: "LMP",
    rgba: "rgba(80, 17, 77, 1)", // Magenta
  },
  {
    abbreviation: "KEINE",
    rgba: "rgba(238, 153, 73, 1)", // Red
  },
];

export const getPartyColorByAbbreviation = (abbreviation: string) => {
  const party = partiesWithColors.find(
    (party) => party.abbreviation === abbreviation
  );

  if (!party) {
    return "#000000";
  }

  return party.rgba;
};

export const getPartyLabelColorByAbbreviation = (abbreviation: string) => {
  const party = partiesWithColors.find(
    (party) => party.abbreviation === abbreviation
  );

  if (!party) {
    return "#000000";
  }

  return party.labelColor;
};
