import React, { useState } from "react";

export type Range = {
  min: number;
  max: number;
};

export type Metric<T extends number | Range> = {
  label: string;
  value: T;
  unit?: string;
  displayFn?: (value: T, unit?: string) => string;
};

const MetricsCarousel = <T extends number | Range>({
  metrics,
}: {
  metrics: Metric<T>[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextMetric = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % metrics.length);
  };

  const prevMetric = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + metrics.length) % metrics.length
    );
  };

  const { label, value, unit = "", displayFn } = metrics[currentIndex];

  const defaultDisplayFn = (value: T, unit?: string) => {
    if (typeof value === "number") {
      return unit ? `${value} ${unit}` : `${value}`;
    } else {
      return unit
        ? `${value.min}-${value.max} ${unit}`
        : `${value.min}-${value.max}`;
    }
  };

  const displayValue = (displayFn || defaultDisplayFn)(value, unit);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <button onClick={prevMetric} className="px-2 pointer-events-auto">
          {`<`}
        </button>
        <div className="text-xs mt-1">{label}</div>
        <button onClick={nextMetric} className="px-2 pointer-events-auto">
          {`>`}
        </button>
      </div>
      <div className="font-bold text-lg">{displayValue}</div>
    </div>
  );
};

export default MetricsCarousel;
