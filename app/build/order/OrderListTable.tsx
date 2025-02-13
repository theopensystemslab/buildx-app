"use client";
import { ArrowDown } from "@carbon/icons-react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { csvFormatRows } from "d3-dsv";
import { memo, useEffect, useMemo } from "react";
import { capitalizeFirstLetters } from "~/utils/functions";
import PaginatedTable from "../PaginatedTable";
import {
  OrderListRow,
  useHouses,
  useOrderListData,
  useProjectCurrency,
} from "@opensystemslab/buildx-core";
import { getColorClass } from "~/analyse/ui/colors";
import config from "@/buildx-app.config.json";
import { useSelectedHouseIds } from "@/app/ui/HousesPillsSelector";

type Props = {
  setCsvDownloadUrl: (s: string) => void;
};

export const useOrderListDownload = (orderListRows: OrderListRow[]) =>
  useMemo(() => {
    if (orderListRows.length > 0) {
      // Create a header row
      const headers = Object.keys(orderListRows[0]).filter(
        (x) => !["houseId"].includes(x)
      ) as Array<keyof OrderListRow>;

      // Map each object to an array of its values
      const rows = orderListRows.map((row) =>
        headers.map((header) => row[header]?.toString() ?? "")
      );

      // Combine header and rows
      const csvData = [headers, ...rows];

      // Format the 2D array into a CSV string
      const csvContent = csvFormatRows(csvData);

      // Create a Blob and URL for the CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      return { url: URL.createObjectURL(blob), blob };
    }
  }, [orderListRows]);

const OrderListTable = (props: Props) => {
  const { setCsvDownloadUrl } = props;

  const selectedHouseIds = useSelectedHouseIds();

  const {
    orderListRows,
    totalMaterialCost,
    totalManufacturingCost,
    totalTotalCost,
    fmt,
  } = useOrderListData(selectedHouseIds);

  const orderListDownload = useOrderListDownload(orderListRows);

  const { format } = useProjectCurrency();

  useEffect(() => {
    if (orderListDownload) setCsvDownloadUrl(orderListDownload.url);
  }, [orderListDownload, setCsvDownloadUrl]);

  const columnHelper = createColumnHelper<OrderListRow>();

  const columns: ColumnDef<OrderListRow, any>[] = useMemo(
    () =>
      [
        columnHelper.accessor("buildingName", {
          id: "Building Name",
          cell: (info) => {
            return <div>{capitalizeFirstLetters(info.getValue())}</div>;
          },
          header: () => null,
        }),
        columnHelper.accessor("blockName", {
          id: "Block Name",
          cell: (info) => <span>{info.getValue()}</span>,
          header: () => <span>Block type</span>,
          footer: () => <span>Total</span>,
        }),
        columnHelper.accessor("thumbnailBlob", {
          id: "Block Thumbnail",
          cell: (info) => {
            const thumbnailBlob = info.getValue();
            return thumbnailBlob ? (
              <div
                className="h-20 w-20 flex-none rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${URL.createObjectURL(thumbnailBlob)})`,
                }}
              ></div>
            ) : (
              <div className="h-20 w-20 flex-none rounded-full bg-transparent"></div>
            );
          },
          header: () => <span>Image</span>,
        }),
        columnHelper.accessor("count", {
          id: "Count",
          cell: (info) => <span>{info.getValue()}</span>,
          header: () => <span>Count</span>,
          footer: () => (
            <span>
              {orderListRows.reduce((sum, row) => sum + row.count, 0)}
            </span>
          ),
        }),
        columnHelper.accessor("costPerBlock", {
          id: "Cost Per Block",
          cell: (info) => <span>{fmt(info.getValue())}</span>,
          header: () => <span>Cost per Block</span>,
        }),
        columnHelper.accessor("materialsCost", {
          id: "Materials Cost",
          cell: (info) => <span>{fmt(info.getValue())}</span>,
          header: () => <span>Material Cost</span>,
          footer: () => <span>{format(totalMaterialCost)}</span>,
        }),
        columnHelper.accessor("manufacturingCost", {
          id: "Manufacturing Cost",
          cell: (info) => <span>{fmt(info.getValue())}</span>,
          header: () => <span>Manufacturing Cost</span>,
          footer: () => <span>{format(totalManufacturingCost)}</span>,
        }),
        columnHelper.accessor("embodiedCarbonGwp", {
          id: "Embodied Carbon Gwp",
          cell: (info) => <span>{info.getValue().toFixed(1)}</span>,
          header: () => <span>Embodied Carbon Gwp</span>,
          footer: () => (
            <span>
              {orderListRows
                .reduce((sum, row) => sum + row.embodiedCarbonGwp, 0)
                .toFixed(1)}
            </span>
          ),
        }),
        config.cuttingFiles !== "false"
          ? columnHelper.accessor("cuttingFileUrl", {
              id: "Cutting File URL",
              cell: (info) => (
                <a href={info.getValue()}>
                  <div className="flex font-semibold items-center">
                    <span>Download</span>
                    <span>
                      <ArrowDown size="20" className="ml-1" />
                    </span>
                  </div>
                </a>
              ),
              header: () => <span>Cutting File</span>,
            })
          : null,
        columnHelper.accessor("totalCost", {
          id: "Total Cost",
          cell: (info) => <span>{fmt(info.getValue())}</span>,
          header: () => <span>Total cost</span>,
          footer: () => <span>{`${format(totalTotalCost)} + VAT`}</span>,
        }),
      ].filter(Boolean) as ColumnDef<OrderListRow, any>[],
    [
      columnHelper,
      fmt,
      format,
      orderListRows,
      totalManufacturingCost,
      totalMaterialCost,
      totalTotalCost,
    ]
  );

  const allHouseIds = useHouses().map((x) => x.houseId);

  return (
    <PaginatedTable
      data={orderListRows.map((x) => ({
        ...x,
        colorClass: getColorClass(allHouseIds, x.houseId),
      }))}
      columns={columns}
    />
  );
};

export default memo(OrderListTable);
