// useSharingWorker.ts
import { useRef, useEffect } from "react";

const useSharingWorker = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./sharing.worker.ts", import.meta.url),
      {
        type: "module",
      }
    );
    return () => {
      workerRef.current?.terminate();
    };
  }, []);
};

export default useSharingWorker;
