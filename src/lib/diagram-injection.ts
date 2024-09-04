import React from "react";
import { ElectionVennController } from "../components/election-venn-controller";
import ReactDOM from "react-dom/client";
import { WahlkabineElectionWrapperMinimal } from "../wahlkabine-data/types";

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
    React.createElement(ElectionVennController, {
      election: election,
      defaultSelectedParties: defaultSelectedParties,
      sourcePath: sourcePath,
      showEmbedCode: true,
      breakPoint: breakPoint,
    })
  );
};

window.hydrateElectionVennController = hydrateElectionVennController;

declare global {
  interface Window {
    hydrateElectionVennController: typeof hydrateElectionVennController;
  }
}
