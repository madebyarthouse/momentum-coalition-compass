import React from "react";
import ReactDOM from "react-dom/client";
import { WahlkabineElectionWrapperMinimal } from "../wahlkabine-data/types";
import { VennPage } from "../pages/venn-page";

const hydrateElectionVennController = ({
  election,
  defaultSelectedParties,
  sourcePath,
  breakPoint = "laptop",
}: {
  election: WahlkabineElectionWrapperMinimal;
  defaultSelectedParties?: string[];
  sourcePath?: string;
  breakPoint?: "laptop" | "tablet";
}) => {
  const root = document.getElementById("election-venn");
  if (!root) {
    console.error("Could not find #election-venn element");
    return;
  }

  ReactDOM.createRoot(root).render(
    React.createElement(VennPage, {
      election: election,
      // defaultSelectedParties: defaultSelectedParties,
      sourcePath: sourcePath,
      // showEmbedCode: true,
      breakPoint: breakPoint,
      showCredits: true,
      embed: true,
    })
  );
};

window.hydrateElectionVennController = hydrateElectionVennController;

declare global {
  interface Window {
    hydrateElectionVennController: typeof hydrateElectionVennController;
  }
}
