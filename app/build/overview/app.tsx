"use client";
import { ArrowDown } from "@carbon/icons-react";
import {
  useAnalysisData,
  useOrderListData,
  useProjectCurrency,
  useProjectData,
  useTotalCosts,
} from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { Fragment } from "react";
import { A } from "~/utils/functions";
import css from "./app.module.css";
import MinimalBuildXScene from "./MinimalBuildXScene";
import useDownloads from "./useDownloads";
import { useSelectedHouseIds } from "@/app/ui/HousesPillsSelector";

const OverviewIndex = () => {
  const { format, kformat } = useProjectCurrency();

  const { projectName, shareUrlPayload } = useProjectData();

  const origin = window.location.protocol + "//" + window.location.host;

  const shareUrl =
    shareUrlPayload === null ? origin : `${origin}?q=${shareUrlPayload}`;

  const typeformUrl = `https://form.typeform.com/to/zePfnP4K?url=${encodeURIComponent(
    shareUrl
  )}`;

  const selectedHouseIds = useSelectedHouseIds();

  const { totalTotalCost } = useOrderListData(selectedHouseIds);

  const { byHouse } = useAnalysisData();

  const { labourTotal, materialsTotals } = useTotalCosts(selectedHouseIds);

  // Calculate metrics only for selected houses
  const selectedHousesMetrics = selectedHouseIds.reduce(
    (acc, houseId) => {
      const house = byHouse[houseId];
      if (!house) return acc;

      return {
        totalFloorArea: acc.totalFloorArea + house.areas.totalFloor,
        embodiedCo2Min: acc.embodiedCo2Min + house.embodiedCo2.total.min,
        embodiedCo2Max: acc.embodiedCo2Max + house.embodiedCo2.total.max,
        costMin: acc.costMin + house.costs.total.min,
        costMax: acc.costMax + house.costs.total.max,
      };
    },
    {
      totalFloorArea: 0,
      embodiedCo2Min: 0,
      embodiedCo2Max: 0,
      costMin: 0,
      costMax: 0,
    }
  );

  const {
    allFilesZipURL,
    materialsListCsvURL,
    modelsZipURL,
    orderListCsvURL,
    labourListCsvURL: labourCsvURL,
  } = useDownloads();

  const overviewFields = [
    {
      label: "Total floor area",
      value: `${selectedHousesMetrics.totalFloorArea.toFixed(1)}m²`,
    },
    {
      label: (
        <div>
          <div>Total estimated WikiHouse chassis cost</div>
          <div className="text-grey-50">
            Includes structure and insulation. Does not include shipping.
          </div>
        </div>
      ),
      value: `${format(totalTotalCost)} + VAT`,
    },
    {
      label: "Total estimated build cost",
      value: `${kformat(
        materialsTotals.totalEstimatedCost.min + labourTotal
      )} to ${kformat(materialsTotals.totalEstimatedCost.max + labourTotal)}`,
    },
    {
      label: "Total estimated carbon cost",
      value: `${(materialsTotals.totalCarbonCost.min / 1000).toFixed(2)} to ${(
        materialsTotals.totalCarbonCost.max / 1000
      ).toFixed(2)} tCO₂e`,
    },
  ];

  return (
    <Fragment>
      <div className="relative w-full h-96">
        <MinimalBuildXScene />
      </div>
      <div className={css.markupGrid}>
        <div className="border-r border-grey-20">
          <h2 className="p-4">Overview</h2>
          <div className="flex flex-col">
            {pipe(
              overviewFields,
              A.mapWithIndex((i, { label, value }) => (
                <div
                  key={i}
                  className="flex justify-between border-t border-grey-20 px-3 py-3"
                >
                  <div>{label}</div>
                  <div>{value}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="relative">
          <h2>Downloads</h2>

          <div className="flex flex-col space-y-4 mt-4">
            {modelsZipURL && (
              <a href={modelsZipURL} download={`3d-models.zip`}>
                <div className="flex font-semibold tracking-wide">
                  <span>Download 3D models</span>
                  <span>
                    <ArrowDown
                      width="1em"
                      height="1em"
                      className="ml-2 translate-y-[15%]"
                    />
                  </span>
                </div>
              </a>
            )}
            {orderListCsvURL && (
              <a href={orderListCsvURL} download={`order-list.csv`}>
                <div className="flex font-semibold tracking-wide">
                  <span>Download order list</span>
                  <span>
                    <ArrowDown
                      width="1em"
                      height="1em"
                      className="ml-2 translate-y-[15%]"
                    />
                  </span>
                </div>
              </a>
            )}
            {materialsListCsvURL && (
              <a href={materialsListCsvURL} download={`materials-list.csv`}>
                <div className="flex font-semibold tracking-wide">
                  <span>Download list of materials</span>
                  <span>
                    <ArrowDown
                      width="1em"
                      height="1em"
                      className="ml-2 translate-y-[15%]"
                    />
                  </span>
                </div>
              </a>
            )}
          </div>
          {allFilesZipURL && (
            <a
              href={allFilesZipURL}
              download={`${projectName ?? "all-files"}.zip`}
            >
              <div className="absolute bottom-0 right-0 w-full bg-grey-20 px-3 py-3 font-semibold flex justify-between pb-12 tracking-wide">
                <div>Download all project files</div>
                <ArrowDown size="20" className="ml-8" />
              </div>
            </a>
          )}
        </div>
        <div className="relative">
          <h2>{`Get started`}</h2>
          <p>
            Download your project files. You will want these to share with
            others later.
          </p>

          <p>
            Then tap ‘start your project’. We will ask you a series of questions
            about how you want to deliver your project.
          </p>

          <p>
            If we can, we will help connect you with designers, engineers,
            manufacturers or installers who will be able to give you exact
            quotes, and help make your project happen.
          </p>
        </div>
        <div className="relative">
          <a href={typeformUrl} target="_blank" rel="noopener noreferrer">
            <div className="absolute bottom-0 right-0 w-full bg-grey-90 text-white px-5 py-3 font-semibold flex justify-between pb-12 tracking-wide">
              <div>Contact us about your project</div>
              <ArrowDown size="20" className="ml-8 rotate-[225deg]" />
            </div>
          </a>
        </div>
      </div>
    </Fragment>
  );
};

export default OverviewIndex;
