// png-snapshots.worker.ts
import { PngSnapshotsWorkerUtils } from "@opensystemslab/buildx-core/worker-utils";

self.onmessage = PngSnapshotsWorkerUtils.onHouseUpdate;
