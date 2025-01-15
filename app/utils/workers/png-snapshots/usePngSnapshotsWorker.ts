// usePngSnapshotsWorker.ts
import { PngSnapshotsWorkerUtils } from "@opensystemslab/buildx-core/worker-utils";
import { useEffect, useRef } from "react";

type UpsertParams = Parameters<
  typeof PngSnapshotsWorkerUtils.upsertSnapshot
>[0];
type DeleteParams = Parameters<
  typeof PngSnapshotsWorkerUtils.deleteSnapshot
>[0];

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

  return {
    upsertSnapshot: (payload: UpsertParams) => {
      workerRef.current?.postMessage({ type: "upsert", payload });
    },
    deleteSnapshot: (payload: DeleteParams) => {
      workerRef.current?.postMessage({ type: "delete", payload });
    },
  };
};

export default usePngSnapshotsWorker;
