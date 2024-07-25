import { increment } from "worker-hell/utils";

console.log("foo worker starting");

self.onmessage = (e: MessageEvent<{ value: number }>) => {
  const bar = increment(e.data.value);
  self.postMessage({ bar });
};
