import { useOutputsFiles } from "@opensystemslab/buildx-core";

const useDownloads = (): {
  allFilesZipURL: string | null;
  modelsZipURL: string | null;
  materialsListCsvURL: string | null;
  orderListCsvURL: string | null;
  labourListCsvURL: string | null;
} => {
  const {
    allFilesZip,
    materialsListCsv,
    modelsZip,
    orderListCsv,
    labourListCsv,
  } = useOutputsFiles();

  let allFilesZipURL = null,
    modelsZipURL = null,
    materialsListCsvURL = null,
    orderListCsvURL = null,
    labourListCsvURL = null;

  /* URLs are only created when the relevant blob is non-null */
  if (allFilesZip) {
    allFilesZipURL = URL.createObjectURL(allFilesZip);
  }
  if (modelsZip) {
    modelsZipURL = URL.createObjectURL(modelsZip);
  }
  if (materialsListCsv) {
    materialsListCsvURL = URL.createObjectURL(materialsListCsv);
  }
  if (orderListCsv) {
    orderListCsvURL = URL.createObjectURL(orderListCsv);
  }

  return {
    allFilesZipURL,
    materialsListCsvURL,
    modelsZipURL,
    orderListCsvURL,
    labourListCsvURL,
  };
};

export default useDownloads;
