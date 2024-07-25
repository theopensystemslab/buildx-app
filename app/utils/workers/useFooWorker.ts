"use client";
import { useEffect, useRef } from "react";

const useFooWorker = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./foo-worker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    workerRef.current.onmessage = (e) => {
      console.log(e.data);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return () => workerRef.current?.postMessage({ value: 1 });
};

export default useFooWorker;
