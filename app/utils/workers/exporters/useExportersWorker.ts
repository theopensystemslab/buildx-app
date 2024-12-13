// useExportersWorker.ts
import { ExportersWorkerUtils } from "@opensystemslab/buildx-core/worker-utils";
import { useEffect, useRef } from "react";

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

  return (v: Parameters<typeof ExportersWorkerUtils.updateModels>[0]) => {
    workerRef.current?.postMessage(v);
  };
};
