import {
  OrderListRow,
  SceneContextMode,
  SceneContextModeLabel,
  useAnalysisData,
  useHouses,
  useOrderListData,
  useProjectCurrency,
} from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { useEffect, useRef, useState } from "react";
import IconButton from "../../../ui/IconButton";
import { Analyse, Close } from "../../../ui/icons";
import { A, NEA, O, R, S } from "../../../utils/functions";
import MetricsCarousel, { Metric, Range } from "./MetricsCarousel";
import css from "./MetricsWidget.module.css";

const MetricsWidget = ({ mode }: { mode: SceneContextMode | null }) => {
  const buildingMode = mode?.label === SceneContextModeLabel.Enum.BUILDING;

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

  const { costs, embodiedCo2, byHouse, areas } = useAnalysisData();
  const currency = useProjectCurrency();

  const houses = useHouses();

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

  const totalChassisCost = pipe(
    houseChassisCosts,
    R.reduce(S.Ord)(0, (b, a) => b + a)
  );

  const hasHouseBeenAdded = useRef(false);

  const [isOpen, setOpen] = useState(true);
  const toggleOpen = () => setOpen(!isOpen);

  useEffect(() => {
    if (houses.length === 1 && !hasHouseBeenAdded.current) {
      setOpen(true);
      hasHouseBeenAdded.current = true;
    }
    if (houses.length === 0 && hasHouseBeenAdded.current) {
      hasHouseBeenAdded.current = false;
    }
  }, [houses]);

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
            value: costs.total,
            displayFn: ({ min, max }: Range) =>
              `${formatCurrencyWithK(min)} to ${formatCurrencyWithK(max)}`,
          },
          {
            displayFn: (value: number) => formatCurrencyWithK(value),
          },
          {
            label: "Estimated chassis cost",
            value: totalChassisCost,
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
              min: embodiedCo2.total.min / 1000,
              max: embodiedCo2.total.max / 1000,
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
    <div className={css.root}>
      {!isOpen && (
        <IconButton
          onClick={toggleOpen}
          // className={clsx(iconButtonStyles, "bg-white hover:bg-white")}
        >
          <div className="flex items-center justify-center">
            <Analyse />
          </div>
        </IconButton>
      )}

      {isOpen && (
        <div className="relative">
          {/* <button
            className="absolute top-0 right-0 px-3 py-2 bg-red-200 rounded"
            onClick={toggleOpen}
          >
            {"X"}
          </button> */}

          <div className="absolute top-0 right-0 flex items-center mt-1 justify-end">
            <button className="w-8" onClick={toggleOpen}>
              <Close />
            </button>
            {/* <IconButton onClick={toggleOpen}>
              <Close />
            </IconButton> */}
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
