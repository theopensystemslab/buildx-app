"use client";
import {
  decodeShareUrlPayload,
  setHouses,
  updateLocatePolygon,
  updateProjectData,
} from "@opensystemslab/buildx-core";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const App = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  useEffect(() => {
    if (!q) {
      if (process.env.ENABLE_TAKEDOWN !== "true") {
        router.push("/locate");
      }
      return;
    }

    try {
      const { houses, polygon, projectName } = decodeShareUrlPayload(q);

      updateProjectData({ projectName });
      if (houses && houses.length > 0) setHouses(houses);
      if (polygon !== null) updateLocatePolygon(polygon);

      switch (true) {
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
