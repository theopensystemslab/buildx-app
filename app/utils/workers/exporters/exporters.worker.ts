// outputsWorker.ts
import { ExportersWorkerUtils } from "@opensystemslab/buildx-core/worker-utils";

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case "upsert":
      ExportersWorkerUtils.upsertModels(payload);
      break;
    case "delete":
      ExportersWorkerUtils.deleteModels(payload);
      break;
  }
};
