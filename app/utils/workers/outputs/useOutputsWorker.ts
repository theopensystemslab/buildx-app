import { useEffect, useRef } from "react";

const useOutputsWorker = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./outputs.worker.ts", import.meta.url)
    );
    return () => {
      workerRef.current?.terminate();
    };
  }, []);
};

export default useOutputsWorker;
