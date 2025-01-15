// png-snapshots.worker.ts
import { PngSnapshotsWorkerUtils } from "@opensystemslab/buildx-core/worker-utils";

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case "upsert":
      PngSnapshotsWorkerUtils.upsertSnapshot(payload);
      break;
    case "delete":
      PngSnapshotsWorkerUtils.deleteSnapshot(payload);
      break;
  }
};
