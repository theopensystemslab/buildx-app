"use client";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { memo, useEffect, useMemo } from "react";
import { csvFormatRows } from "d3-dsv";
import {
  useLabourListRows,
  useProjectCurrency,
  useHouses,
  LabourListRow,
} from "@opensystemslab/buildx-core";
import { getColorClass } from "~/analyse/ui/colors";
import { capitalizeFirstLetters } from "~/utils/functions";
import PaginatedTable from "../PaginatedTable";
import { pipe } from "fp-ts/lib/function";
import { A } from "~/utils/functions";

type Props = {
  setCsvDownloadUrl: (s: string) => void;
};

export const useLabourListDownload = (labourListRows: LabourListRow[]) =>
  useMemo(() => {
    if (labourListRows.length > 0) {
      const headers = Object.keys(labourListRows[0]).filter(
        (x) => !["houseId"].includes(x)
      ) as Array<keyof LabourListRow>;

      const rows = labourListRows.map((row) =>
        headers.map((header) => row[header]?.toString() ?? "")
      );

      const csvData = [headers, ...rows];
      const csvContent = csvFormatRows(csvData);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      return { url: URL.createObjectURL(blob), blob };
    }
  }, [labourListRows]);

const LabourTable = (props: Props) => {
  const { setCsvDownloadUrl } = props;
  const { symbol, format } = useProjectCurrency();

  const labourListRows = useLabourListRows();
  const houses = useHouses();
  const allHouseIds = houses.map((x) => x.houseId);

  const labourListDownload = useLabourListDownload(labourListRows);

  useEffect(() => {
    if (labourListDownload) {
      setCsvDownloadUrl(labourListDownload.url);
    }
  }, [labourListDownload, setCsvDownloadUrl]);

  const totalCost = pipe(
    labourListRows,
    A.reduce(0, (acc, row) => acc + row.cost)
  );

  const columnHelper = createColumnHelper<LabourListRow>();

  const columns: ColumnDef<LabourListRow, any>[] = useMemo(
    () => [
      columnHelper.accessor("buildingName", {
        id: "Building Name",
        cell: (info) => <div>{capitalizeFirstLetters(info.getValue())}</div>,
        header: () => null,
      }),
      columnHelper.accessor("labourType", {
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <span>Labour Type</span>,
      }),
      columnHelper.accessor("hours", {
        cell: (info) => <span>{info.getValue().toFixed(1)}h</span>,
        header: () => <span>Hours</span>,
      }),
      columnHelper.accessor("cost", {
        cell: (info) => <span>{format(info.getValue())}</span>,
        header: () => <span>Cost</span>,
        footer: () => <span>{format(totalCost)}</span>,
      }),
    ],
    [columnHelper, format, totalCost]
  );

  const enhancedRows = labourListRows.map((row) => ({
    ...row,
    colorClass: getColorClass(allHouseIds, row.houseId),
  }));

  return <PaginatedTable data={enhancedRows} columns={columns} />;
};

export default memo(LabourTable);
