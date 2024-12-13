"use client";
import useOutputsWorker from "./utils/workers/outputs/useOutputsWorker";
import useSystemsWorker from "./utils/workers/systems/useSystemsWorker";

const GlobalClientSideEffects = () => {
  useSystemsWorker();
  useOutputsWorker();

  return null;
};

export default GlobalClientSideEffects;
