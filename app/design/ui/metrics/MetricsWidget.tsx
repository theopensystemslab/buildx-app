import {
  OrderListRow,
  SceneContextMode,
  SceneContextModeLabel,
  useAnalysisData,
  useHouses,
  useOrderListData,
  useProjectCurrency,
  useTotalCosts,
} from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { useEffect, useRef, useState } from "react";
import IconButton from "../../../ui/IconButton";
import { Analyse, Close } from "../../../ui/icons";
import { A, NEA, O, R, S } from "../../../utils/functions";
import MetricsCarousel, { Metric, Range } from "./MetricsCarousel";
import css from "./MetricsWidget.module.css";

interface MetricsWidgetProps {
  mode: SceneContextMode | null;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const MetricsWidget = ({ mode, isOpen, setOpen }: MetricsWidgetProps) => {
  const buildingMode =
    mode?.label &&
    [
      SceneContextModeLabel.Enum.BUILDING,
      SceneContextModeLabel.Enum.ROW,
      // @ts-ignore
    ].includes(mode.label);

  const houseId =
    mode !== null
      ? pipe(
          mode.buildingHouseGroup,
          O.match(
            () => null,
            (v) => v.userData.houseId
          )
        )
      : null;

  const houses = useHouses();
  const allHouseIds = houses.map((h) => h.houseId);
  const relevantHouseIds = buildingMode && houseId ? [houseId] : allHouseIds;

  const { labourTotal, materialsTotals } = useTotalCosts(relevantHouseIds);
  const { totalTotalCost } = useOrderListData(relevantHouseIds);

  const { byHouse, areas } = useAnalysisData();
  const currency = useProjectCurrency();

  const { orderListRows } = useOrderListData();

  const orderListRowsByHouse: Record<string, OrderListRow[]> = A.isNonEmpty(
    orderListRows
  )
    ? pipe(
        orderListRows,
        NEA.groupBy((x) => x.houseId)
      )
    : {};

  const houseChassisCosts = pipe(
    orderListRowsByHouse,
    R.map(A.reduce(0, (b, a) => b + a.totalCost))
  );

  const hasHouseBeenAdded = useRef(false);

  useEffect(() => {
    if (houses.length === 1 && !hasHouseBeenAdded.current) {
      setOpen(true);
      hasHouseBeenAdded.current = true;
    }
    if (houses.length === 0 && hasHouseBeenAdded.current) {
      hasHouseBeenAdded.current = false;
    }
  }, [houses, setOpen]);

  function formatNumberWithK(number: number): string {
    if (number >= 1000) {
      return (number / 1000).toFixed(0) + "k";
    } else {
      return number.toString();
    }
  }

  function formatCurrencyWithK(number: number): string {
    return `${currency.symbol}${formatNumberWithK(number)}`;
  }

  const topMetrics =
    buildingMode && houseId && houseId in byHouse
      ? [
          {
            label: "Estimated build cost",
            value: byHouse[houseId].costs.total,
            displayFn: ({ min, max }: Range) =>
              `${formatCurrencyWithK(min)} to ${formatCurrencyWithK(max)}`,
          },
          {
            label: "Estimated chassis cost",
            value: houseChassisCosts[houseId],
            displayFn: (value: number) => formatCurrencyWithK(value),
          },
        ]
      : [
          {
            label: "Estimated build cost",
            value: {
              min: materialsTotals.totalEstimatedCost.min + labourTotal,
              max: materialsTotals.totalEstimatedCost.max + labourTotal,
            },
            displayFn: ({ min, max }: Range) =>
              `${formatCurrencyWithK(min)} to ${formatCurrencyWithK(max)}`,
          },
          {
            label: "Estimated chassis cost",
            value: totalTotalCost,
            displayFn: (value: number) =>
              value.toLocaleString("en-GB", {
                style: "currency",
                currency: currency.code,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
          },
        ];

  const bottomMetrics =
    buildingMode && houseId && houseId in byHouse
      ? [
          {
            label: "Estimated carbon cost",
            value: {
              min: byHouse[houseId!].embodiedCo2.total.min / 1000,
              max: byHouse[houseId!].embodiedCo2.total.max / 1000,
            },
            unit: "tCO₂e",
            displayFn: (value, unit) =>
              `${value.min.toFixed(2)} to ${value.max.toFixed(2)} ${unit}`,
          } as Metric<Range>,
          {
            label: "Internal floor area",
            value: byHouse[houseId!].areas.totalFloor,
            unit: "m²",
            displayFn: (value, unit) => `${value.toFixed(2)} ${unit}`,
          } as Metric<number>,
        ]
      : [
          {
            label: "Estimated carbon cost",
            value: {
              min: materialsTotals.totalCarbonCost.min / 1000,
              max: materialsTotals.totalCarbonCost.max / 1000,
            },
            unit: "tCO₂e",
            displayFn: (value, unit) =>
              `${value.min.toFixed(2)} to ${value.max.toFixed(2)} ${unit}`,
          } as Metric<Range>,
          {
            label: "Internal floor area",
            value: areas.totalFloor,
            unit: "m²",
            displayFn: (value, unit) => `${value.toFixed(2)} ${unit}`,
          } as Metric<number>,
        ];

  return (
    <div className={css.container}>
      {!isOpen && (
        <IconButton onClick={() => setOpen(true)}>
          <div className="flex items-center justify-center">
            <Analyse />
          </div>
        </IconButton>
      )}

      {isOpen && (
        <div className={css.overlay}>
          <div className="absolute top-0 right-0 flex items-center mt-1 justify-end">
            <button className="w-8" onClick={() => setOpen(false)}>
              <Close />
            </button>
          </div>
          <div className="pt-10 pb-6 pr-6">
            <MetricsCarousel metrics={topMetrics as Metric<number | Range>[]} />
            <MetricsCarousel
              metrics={bottomMetrics as Metric<number | Range>[]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsWidget;
