"use client";
import useSystemsWorker from "./utils/workers/systems/useSystemsWorker";

const GlobalClientSideEffects = () => {
  useSystemsWorker();

  return null;
};

export default GlobalClientSideEffects;
