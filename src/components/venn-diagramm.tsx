import { useEffect, useId, useRef, useState } from "react";
import { EulerDiagramChart, extractSets } from "chartjs-chart-venn";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import { combineColors, rgbaString } from "../utils/colors";
import { VennDetails } from "./venn-details";
import { getPartyColorByAbbreviation } from "../utils/partiesWithColors";
import { useMediaQuery } from "@uidotdev/usehooks";
import clsx from "clsx";
import { useShare } from "../hooks/use-share";
import { ShareIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { useVersionendLocalStorage } from "../hooks/use-versionend-local-storage";

Chart.register(...registerables);

export const ChartVenn = ({
  data,
  label,
  bgColors,
  matchingScore,
  logoPath,
  breakPoint,
}: {
  data: {
    label: string;
    values: string[];
  }[];
  label: string;
  bgColors: string[];
  logoPath?: string;
  matchingScore?: number;
  breakPoint?: "laptop" | "tablet";
}) => {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const vennDetailsRef = useRef<HTMLDivElement | null>(null);
  const [prevWidth, setPrevWidth] = useState<number | null>(null);
  const [activeElement, setActiveElement] = useState<{
    label: string;
    values: string[];
  } | null>(null);
  const [activeElementLocked, setActiveElementLocked] = useState<{
    label: string;
    values: string[];
  } | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const isTablet = useMediaQuery("(min-width: 541px) and (max-width: 768px)");
  const isMediumMobile = useMediaQuery(
    "(min-width: 421px) and (max-width: 540px)"
  );
  const isMobile = useMediaQuery("(max-width: 420px)");
  const isTouch = useMediaQuery("(hover: none)");

  const { copied, share } = useShare();

  const defaultScale = isMobile
    ? 200
    : isMediumMobile
    ? 150
    : isTablet
    ? 115
    : 100;

  const [scale, setScale] = useVersionendLocalStorage(
    `scale-${id}`,
    defaultScale
  );

  useEffect(() => {
    const handleClickOutside = () => {
      if (!popoverRef.current) return;

      popoverRef.current.style.display = "none";
      setActiveElement(null);
      setActiveElementLocked(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [popoverRef]);

  useEffect(() => {
    const handleResize = () => {
      if (prevWidth === window.innerWidth) {
        return;
      }

      setPrevWidth(window.innerWidth);
      setScale(defaultScale);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [defaultScale, isMediumMobile, isMobile, isTablet, prevWidth, setScale]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    if (canvasRef.current) {
      Chart.getChart(canvasRef.current.id)?.destroy();
    }

    const vennData = extractSets(data);

    const config: ChartConfiguration<"euler"> = {
      type: "euler",
      data: {
        labels: vennData.labels,
        datasets: vennData.datasets.map((dataset) => ({
          ...dataset,
        })),
      },

      options: {
        interaction: { mode: "nearest", includeInvisible: false, axis: "xy" },
        devicePixelRatio: isMobile ? 6 : 3,
        maintainAspectRatio: true,
        font: {
          family: "Suisse Screen, Inter, Helvetica, Arial, sans-serif",
          weight: "bold",
        },

        indexAxis: "y",

        borderColor: (ctx) => {
          // @ts-expect-error - types are wrong
          const sets = ctx.raw!.sets as string[];

          const colorsForSets = sets.map((set) =>
            getPartyColorByAbbreviation(set)
          );

          const color = combineColors(colorsForSets);
          return rgbaString(color);
        },
        backgroundColor: (ctx) => {
          // @ts-expect-error - types are wrong
          const sets = ctx.raw!.sets as string[];

          const colorsForSets = sets.map((set) =>
            getPartyColorByAbbreviation(set)
          );

          const color = combineColors(colorsForSets);
          color.a = colorsForSets.length > 1 ? 0.5 : 1;
          return rgbaString(color);
        },
        layout: {
          padding: 20,
        },
        plugins: {
          colors: {
            enabled: true,
          },
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "black",
              font: {
                weight: "bold",
                size: isMobile ? 10 : isMediumMobile ? 12 : isTablet ? 14 : 20,
                family: "Suisse Screen, Inter, Helvetica, Arial, sans-serif",
              },
            },
          },
          y: {
            ticks: {
              color: "black",
              font: {
                weight: "bold",
                size: isMobile ? 10 : isMediumMobile ? 12 : isTablet ? 14 : 20,
                family: "Suisse Screen, Inter, Helvetica, Arial, sans-serif",
              },
            },
          },
        },
        onClick(event, elements) {
          if (elements.length > 0) {
            // @ts-expect-error - TODO: Fix typings
            const raw = elements[0].element["$context"]?.["raw"];

            if (raw) {
              const isActiveElement =
                `${raw.label}` === activeElementLocked?.label;

              if (isActiveElement) {
                setActiveElementLocked(null);
                setDetailsOpen(false);

                if (popoverRef.current) {
                  popoverRef.current.style.display = "none";
                }
              } else {
                setActiveElementLocked({
                  label: `${raw.label}`,
                  values: raw.values,
                });
                setDetailsOpen(true);

                if (popoverRef.current) {
                  popoverRef.current.style.display = "block";
                }
              }
            }
          }
        },
        onHover(event, elements) {
          if (elements.length > 0) {
            // @ts-expect-error - TODO: Fix typings
            const raw = elements[0].element["$context"]?.["raw"];

            if (raw) {
              setActiveElement({
                label: `${raw.label}`,
                values: raw.values,
              });

              if (popoverRef.current) {
                popoverRef.current.style.display = "block";
              }
            }
          }
        },
      },
    };
    const vennDiagramChart = new EulerDiagramChart(canvasRef.current, config);

    return () => {
      vennDiagramChart?.destroy();
    };
  }, [
    activeElement,
    activeElement?.label,
    activeElementLocked,
    bgColors,
    canvasRef,
    data,
    isMediumMobile,
    isMobile,
    isTablet,
    label,
    setActiveElement,
    setDetailsOpen,
  ]);

  const generateImage = async () => {
    const bgCanvas = document.createElement("canvas");
    const dpr = window.devicePixelRatio || 1;
    bgCanvas.width = 1000 * dpr;
    bgCanvas.height = 600 * dpr;

    const bgCtx = bgCanvas.getContext("2d", {
      alpha: false,
    });
    if (!bgCtx) {
      alert("Fehler beim Erstellen des Bildes");
      return;
    }

    bgCtx.imageSmoothingEnabled = false;
    bgCtx.fillStyle = "#fff";
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    if (!logoPath) {
      return;
    }

    if (!canvasRef.current) {
      alert("Fehler beim Erstellen des Bildes");
      return;
    }

    const logoPromise = new Promise<HTMLImageElement>((resolve) => {
      const logo = new Image();
      logo.src = logoPath;
      logo.crossOrigin = "anonymous";
      logo.onload = () => {
        resolve(logo);
      };
    });

    const logo = await logoPromise;

    bgCtx.drawImage(
      canvasRef.current,
      100 * dpr,
      120 * dpr,
      800 * dpr,
      400 * dpr
    );

    bgCtx.drawImage(logo, 815 * dpr, (600 - 55) * dpr, 170 * dpr, 41 * dpr);

    bgCtx.fillStyle = "#F25E33";
    const title = `Koalitions-Kompass`;
    bgCtx.font = `bold  ${
      40 * dpr
    }px Suisse Screen, Inter, Helvetica, Arial, sans-serif`;

    const titleWidth = bgCtx.measureText(title).width;

    bgCtx.fillText(title, bgCanvas.width / 2 - titleWidth / 2, 55 * dpr);
    bgCtx.font = `bold ${
      20 * dpr
    }px Suisse Screen, Inter, Helvetica, Arial, sans-serif`;
    bgCtx.fillStyle = "#000";
    const subtitle = `${label}`;
    const subtitleWidth = bgCtx.measureText(subtitle).width;
    bgCtx.fillText(subtitle, bgCanvas.width / 2 - subtitleWidth / 2, 90 * dpr);

    const score = `Übereinstimmung: ${matchingScore}/${data?.[0].values.length}`;
    bgCtx.fillStyle = "#000";
    bgCtx.fillText(score, 10 * dpr, 140 * dpr);

    bgCtx.fillStyle = "#F25E33";
    bgCtx.font = `bold ${
      14 * dpr
    }px Suisse Screen, Inter, Helvetica, Arial, sans-serif`;
    const link = "momentum-institut.at/koalitions-kompass";
    bgCtx.fillText(link, 10 * dpr, (600 - 15) * dpr);

    bgCtx.fillStyle = "#000";
    bgCtx.fillRect(0, 110 * dpr, 1000 * dpr, 1 * dpr);

    bgCtx.fillStyle = "#000";
    bgCtx.fillRect(0, (600 - 70) * dpr, 1000 * dpr, 1 * dpr);

    return bgCtx;
  };

  const elementForDetails = activeElementLocked ?? activeElement;

  return (
    <div className="flex flex-col gap-2 max-w-full relative items-stretch w-[1000px]">
      {createPortal(
        <div className="lg:fixed twp absolute z-50 hidden" ref={popoverRef}>
          {activeElement ? (
            <div
              className={clsx(
                " px-3 py-1  rounded-md max  text-xs max-w-full w-fit  bg-lightBeige backdrop-blur-md border-2 border-peach shadow-lg border-solid text-center"
              )}
            >
              <p className="font-semibold text-base">
                {activeElement.label} ({activeElement.values.length})
                <br />
                <span className={clsx("text-xs", isTouch && "hidden")}>
                  {activeElementLocked
                    ? "Klick um die Auswahl zu unlocken"
                    : "Klick um die Auswahl zu locken"}
                </span>
              </p>
            </div>
          ) : null}
        </div>,
        document.body
      )}

      <div className={clsx("flex flex-col items-start pb-5 ")}>
        <button
          className="appearance-none bg-transparent text-peach font-semibold w-fit flex flex-row gap-2 items-center"
          onClick={async () => {
            const exportCanvas = await generateImage();

            if (!exportCanvas) {
              share({ title: label });
              return;
            }

            const dataUrl = exportCanvas.canvas.toDataURL();
            const blob = await (await fetch(dataUrl)).blob();
            const filesArray: File[] = [
              new File([blob], `${label}.png`, {
                type: blob.type,
                lastModified: new Date().getTime(),
              }),
            ];

            share({ title: label, files: filesArray, link: false });
          }}
        >
          <span>{copied ? "Geteilt/Kopiert" : "Teilen"}</span>
          <ShareIcon className="w-4 h-4 stroke-[3px]" />
        </button>
        <h1
          className={clsx(
            "text-3xl font-bold text-left",
            breakPoint === "laptop" && "lg:text-center",
            breakPoint === "tablet" && "md:text-center"
          )}
        >
          {label}
        </h1>
        {matchingScore !== undefined && (
          <p>
            Koalitions-Übereinstimmung: {matchingScore}/
            {data?.[0].values.length}
          </p>
        )}
      </div>

      <div className="relative">
        <div className="flex flex-row gap-6 items-stretch">
          <aside className="flex flex-1 flex-col gap-2 md:hidden">
            <label htmlFor="scale" className="text-base font-semibold ">
              Größe anpassen
            </label>
            <div className="flex-grow flex items-center w-full">
              <input
                type="range"
                min={isMobile ? 150 : isMediumMobile ? 125 : 100}
                max={isMobile ? 250 : isMediumMobile ? 175 : 125}
                className="accent-peach appearance-auto w-full"
                value={scale}
                onChange={(event) => setScale(parseInt(event.target.value))}
              />
            </div>
          </aside>

          <aside
            className={clsx(
              " flex-1 left-0 -top-0  z-10 flex flex-col gap-2",
              breakPoint === "laptop" && "lg:absolut lg:top-0",
              breakPoint === "tablet" && "md:absolute md:top-0"
            )}
          >
            <h4 className="text-base font-semibold ">Download</h4>
            <div className="flex flex-row gap-2 items-stretch">
              <button
                type="button"
                className=" bg-violet text-white rounded-md w-fit px-2 py-1"
                onClick={async () => {
                  const exportCanvas = await generateImage();

                  if (!exportCanvas) {
                    alert("Fehler beim Erstellen des Bildes");
                    return;
                  }

                  const link = document.createElement("a");
                  link.download = `${label}.png`;
                  link.href = exportCanvas.canvas.toDataURL() ?? "";
                  link.click();
                }}
              >
                .png
              </button>
              <button
                type="button"
                className="z-10 bg-violet text-white rounded-md w-fit px-2 py-1"
                onClick={() => {
                  const jsonString =
                    "data:text/json;charset=utf-8," +
                    encodeURIComponent(
                      JSON.stringify(vennDataToStructuredData(data))
                    );

                  const link = document.createElement("a");
                  link.download = `${label}.json`;
                  link.href = jsonString;
                  link.click();
                }}
              >
                .json
              </button>
              <button
                type="button"
                className="z-10 bg-violet text-white rounded-md w-fit px-2 py-1"
                onClick={() => {
                  const jsonString =
                    "data:text/csv;charset=utf-8," +
                    encodeURIComponent(toCsv(data));

                  const link = document.createElement("a");
                  link.download = `${label}.csv`;
                  link.href = jsonString;
                  link.click();
                }}
              >
                .csv
              </button>
            </div>
          </aside>
        </div>

        <div
          className={clsx(
            "w-full min-h-[350px] overflow-clip",
            breakPoint === "laptop" && "lg:h-fit",
            breakPoint === "tablet" && "md:h-fit"
          )}
        >
          <canvas
            onMouseOver={(event) => {
              if (!popoverRef.current) return;
              if (isTouch) return;

              popoverRef.current.style.display = activeElement
                ? "block"
                : "none";
              popoverRef.current.style.left = `${event.pageX + 10}px`;
              popoverRef.current.style.top = `${event.pageY - 60}px`;
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
            onTouchEnd={(event) => {
              if (!popoverRef.current) return;

              if (event.touches.length > 0) {
                popoverRef.current.style.left = `${
                  event.touches[0].pageX - 40
                }px`;
                popoverRef.current.style.top = `${
                  event.touches[0].pageY - 10
                }px`;
              } else {
                popoverRef.current.style.left = `${
                  event.changedTouches[0].pageX - 40
                }px`;
                popoverRef.current.style.top = `${
                  event.changedTouches[0].pageY - 10
                }px`;
              }

              if (vennDetailsRef.current) {
                vennDetailsRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
              }
            }}
            onMouseMove={(event) => {
              if (!popoverRef.current) return;
              if (isTouch) return;

              popoverRef.current.style.left = `${event.pageX + 10}px`;
              popoverRef.current.style.top = `${event.pageY - 60}px`;
            }}
            onMouseOut={() => {
              if (!popoverRef.current) return;
              if (isTouch) return;

              popoverRef.current.style.display = "none";
            }}
            style={{
              transform: `scale(${scale / 100})`,
            }}
            className="w-full transition-transform transform-gpu origin-top mx-auto"
            ref={canvasRef}
            id={`venn-canvas-${id}`}
          ></canvas>
        </div>
      </div>

      {elementForDetails ? (
        <div
          ref={vennDetailsRef}
          className={clsx(
            "z-40 top-full right-0",
            breakPoint === "laptop" &&
              "xl:absolute xl:top-0 xxl:-right-24 xl:-right-20",
            breakPoint === "tablet" &&
              "lg:absolute lg:top-0 lg:-right-20 xl:-right-24"
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <VennDetails
            key={`details-for-venn-${elementForDetails.label}`}
            breakPoint={breakPoint}
            isOpen={detailsOpen}
            onToggle={() => {
              setDetailsOpen((detailsOpen) => !detailsOpen);
            }}
            questions={elementForDetails.values.map((value) => {
              const [answer, text] = value.split(" – ");
              return {
                text,
                answer,
              };
            })}
            label={elementForDetails.label}
          />
        </div>
      ) : null}
    </div>
  );
};

const vennDataToStructuredData = (
  data: {
    label: string;
    values: string[];
  }[]
) => {
  const structuredData: Array<{
    question: string;
    [key: string]: string;
  }> = [];

  for (const vennData of data) {
    for (const value of vennData.values) {
      const [answer, text] = value.split(" – ");

      if (!structuredData.some((data) => data.question === text)) {
        structuredData.push({
          question: text,
        });
      }

      const csvIndex = structuredData.findIndex(
        (data) => data.question === text
      );
      if (csvIndex === -1) {
        continue;
      }

      structuredData[csvIndex][vennData.label] = answer === "1" ? "Ja" : "Nein";
    }
  }

  return structuredData;
};

const toCsv = (
  data: {
    label: string;
    values: string[];
  }[]
) => {
  const csvData = vennDataToStructuredData(data);

  let csv = "";

  csv += `question,${data.map((data) => data.label).join(",")}\n`;

  for (const data of csvData) {
    csv += `${Object.values(data)
      .map((value) => `"${value}"`)
      .join(",")}\n`;
  }

  return csv;
};
