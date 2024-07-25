import { PngSnapshotsWorkerUtils } from "@opensystemslab/buildx-core/worker-utils";
import { useRef, useEffect, useCallback } from "react";

const usePngSnapshotsWorker = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./png-snapshots.worker.ts", import.meta.url)
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return useCallback(
    async (v: Parameters<typeof PngSnapshotsWorkerUtils.onHouseUpdate>[0]) => {
      workerRef.current?.postMessage(v);
    },
    []
  );
};

export default usePngSnapshotsWorker;
