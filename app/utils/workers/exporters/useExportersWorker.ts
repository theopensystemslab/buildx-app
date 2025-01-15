// useExportersWorker.ts
import { ExportersWorkerUtils } from "@opensystemslab/buildx-core/worker-utils";
import { useEffect, useRef } from "react";

type UpsertParams = Parameters<typeof ExportersWorkerUtils.upsertModels>[0];
type DeleteParams = Parameters<typeof ExportersWorkerUtils.deleteModels>[0];

export const useExportersWorker = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./exporters.worker.ts", import.meta.url)
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return {
    upsertModels: (payload: UpsertParams) => {
      workerRef.current?.postMessage({ type: "upsert", payload });
    },
    deleteModels: (payload: DeleteParams) => {
      workerRef.current?.postMessage({ type: "delete", payload });
    },
  };
};
