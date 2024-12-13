// outputsWorker.ts
import { ExportersWorkerUtils } from "@opensystemslab/buildx-core/worker-utils";

self.onmessage = (e) => {
  ExportersWorkerUtils.updateModels({
    houseId: e.data.houseId,
    objectJson: e.data.objectJson,
  });
};
