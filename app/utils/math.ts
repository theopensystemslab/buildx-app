import { flow } from "fp-ts/lib/function";
import { A } from "./functions";

export const {
  abs,
  atan2,
  min,
  max,
  ceil,
  floor,
  random,
  round,
  PI,
  sign,
  sqrt,
} = Math;

// export { abs, min, max }

export const reverseV2 = ([x, y]: [number, number]): [number, number] => [y, x];

export const hamming = (a: string, b: string) => {
  if (a.length !== b.length) throw new Error("Hamming of different lengths");

  return A.zipWith(a.split(""), b.split(""), (a, b) =>
    abs(a.codePointAt(0)! - b.codePointAt(0)!)
  ).reduce((acc, v) => acc + v, 0);
};

export const mean = (values: number[]) => {
  const filteredValues = values.filter((v) => v !== undefined && !isNaN(v));
  return filteredValues.length > 0
    ? filteredValues.reduce((a, b) => a + b, 0) / filteredValues.length
    : 0;
};
