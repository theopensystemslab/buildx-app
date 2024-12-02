import { BuildSystemsWorkerUtils } from "@opensystemslab/buildx-core/worker-utils";

console.log("systems worker");

BuildSystemsWorkerUtils.loadAllBuildSystemsData()
  .then((result) => {
    console.log({ result });
  })
  .catch((error) => {
    console.error({ error });
  })
  .finally(() => {
    console.log("finally");
  });
