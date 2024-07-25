import { PngSnapshotsWorkerUtils } from "@opensystemslab/buildx-core";
import { useRef, useEffect, useCallback } from "react";

const usePngSnapshotsWorker = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./pngSnapshots.worker.ts", import.meta.url)
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return useCallback(
    async (
      ...args: Parameters<typeof PngSnapshotsWorkerUtils.onHouseUpdate>
    ) => {
      const [arg0] = args;
      workerRef.current?.postMessage(arg0);
    },
    []
  );
};

export default usePngSnapshotsWorker;
