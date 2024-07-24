"use client";
import {
  decodeShareUrlPayload,
  setHouses,
  updateLocatePolygon,
} from "@opensystemslab/buildx-core";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const App = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  useEffect(() => {
    if (!q) {
      router.push("/locate");
      return;
    }

    try {
      const { houses, polygon } = decodeShareUrlPayload(q);
      if (houses) setHouses(houses);
      if (polygon) updateLocatePolygon(polygon);

      switch (true) {
        case polygon !== null && houses !== null:
          router.push("build");
          return;
        case polygon !== null:
          router.push("design");
          return;
        default:
          router.push("locate");
      }
    } catch (e) {
      console.error(e);
      router.push("/locate");
    }
  }, [q, router]);

  return <div></div>;
};

export default App;
