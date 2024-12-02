"use client";
import {
  useAllBuildSystemsDataLiveQuery,
  useAnalysisData,
  useOrderListData,
} from "@opensystemslab/buildx-core";
import HousesPillsSelector, {
  useSelectedHouseIds,
} from "../ui/HousesPillsSelector";
import Loader from "../ui/Loader";
import useOutputsWorker from "../utils/workers/outputs/useOutputsWorker";
import css from "./app.module.css";
import CarbonEmissionsChart from "./ui/CarbonEmissionsChart";
import ChassisCostChart from "./ui/ChassisCostChart";
import FloorAreaChart from "./ui/FloorAreaChart";

const AnalyseAppMain = () => {
  useOutputsWorker();

  const { orderListRows } = useOrderListData();
  const analysisData = useAnalysisData();

  const selectedHouseIds = useSelectedHouseIds();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex-grow-0">
        <HousesPillsSelector />
      </div>
      <div className="flex-auto">
        <div className={css.pageRoot}>
          <ChassisCostChart
            selectedHouseIds={selectedHouseIds}
            orderListRows={orderListRows}
          />
          <FloorAreaChart
            selectedHouseIds={selectedHouseIds}
            analyseData={analysisData}
          />
          <CarbonEmissionsChart
            selectedHouseIds={selectedHouseIds}
            analysisData={analysisData}
          />
        </div>
      </div>
    </div>
  );
};

const AnalyseApp = () => {
  const systemsData = useAllBuildSystemsDataLiveQuery();
  if (!systemsData) return <Loader />;

  const hasEmptyArray = Object.entries(systemsData).reduce(
    (acc, [key, value]) => {
      if (key === "models") return acc;
      return acc || (Array.isArray(value) && value.length === 0);
    },
    false
  );

  if (hasEmptyArray) {
    console.warn("At least one array is empty.");
    return <Loader />;
  }

  return <AnalyseAppMain />;
};

export default AnalyseApp;
