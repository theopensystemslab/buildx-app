// outputsWorker.ts
import { OutputsWorkerUtils } from "@opensystemslab/buildx-core";

if (typeof window !== "undefined" && typeof window.document !== "undefined") {
  OutputsWorkerUtils.houseModelsWatcher();
  OutputsWorkerUtils.housesAndSystemsWatcher();
}
