"use client";
import { ArrowUp } from "@carbon/icons-react";
import {
  OrderListRow,
  useProjectCurrency,
  useOrderListData,
} from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { A, capitalizeFirstLetters, O, R } from "~/utils/functions";
import ChartBar from "./ChartBar";
import {
  ChartColumn,
  ChartContainer,
  ChartMetrics,
  ChartTitles,
  HowIsItCalculated,
  WhatIsThis,
} from "./chartComponents";
import { getColorClass } from "./colors";

const ChassisCostChart = ({
  orderListRows,
  selectedHouseIds,
}: {
  orderListRows: OrderListRow[];
  selectedHouseIds: string[];
}) => {
  const { totalTotalCost } = useOrderListData(selectedHouseIds);
  const orderListByBuilding = pipe(
    orderListRows,
    A.reduce({}, (acc: Record<string, OrderListRow>, x) =>
      pipe(
        acc,
        R.modifyAt(
          x.buildingName,
          ({ totalCost, ...rest }: OrderListRow): OrderListRow => ({
            ...rest,
            totalCost: totalCost + x.totalCost,
          })
        ),
        O.getOrElse(() => pipe(acc, R.upsertAt(x.buildingName, x)))
      )
    )
  );

  const totalCost = Object.values(orderListByBuilding).reduce(
    (acc, v) => acc + v.totalCost,
    0
  );

  const currency = useProjectCurrency();

  return (
    <ChartColumn>
      <ChartTitles
        title="Chassis cost"
        subtitle={`Estimated ${currency.symbol} ${currency.code}`}
      />
      <ChartContainer>
        <div className="grid grid-cols-3 border-b border-black h-full">
          <div />
          {Object.keys(orderListByBuilding).length > 0 && (
            <ChartBar
              items={Object.values(orderListByBuilding)}
              itemToColorClass={(item) =>
                getColorClass(selectedHouseIds, item.houseId)
              }
              itemToValue={(item) => item.totalCost}
              itemToKey={(item) => item.houseId}
              renderItem={(item) => (
                <div className="flex flex-col justify-center  items-center">
                  <div>{capitalizeFirstLetters(item.buildingName)}</div>
                  <div>{currency.kformat(item.totalCost)}</div>
                </div>
              )}
            />
          )}
          <div />
        </div>
      </ChartContainer>
      <ChartMetrics>
        <div className="text-5xl font-normal flex">
          {currency.kformat(totalTotalCost)}
        </div>
        <div>
          <div>
            <span className="text-3xl">
              <ArrowUp className="inline" width="1em" height="1em" />
              <span>{`10%`}</span>
            </span>
          </div>

          <div className="mt-4">
            <span>Compared to conventional new build</span>
          </div>
        </div>
      </ChartMetrics>
      <WhatIsThis>
        <p>
          This is an estimated cost of the main WikiHouse chassis, insulated. It
          does not include windows, cladding, linings or fit-out. Your WikiHouse
          chassis replaces floors, walls, roof and many battens. It has a higher
          up front cost, but saves money later because it is so quick to build
          and so easy to fit-out.
        </p>
      </WhatIsThis>
      <HowIsItCalculated>
        <p>
          This is based on material and manufacturing costs from recent
          projects. Find a manufacturer to get a precise quote.
        </p>
      </HowIsItCalculated>
    </ChartColumn>
  );
};
export default ChassisCostChart;
