import { useEffect } from "react";

const useSystemsWorker = () => {
  useEffect(() => {
    const worker = new Worker(new URL("./systems.worker.ts", import.meta.url));

    return () => worker.terminate();
  }, []);

  return null;
};

export default useSystemsWorker;
