"use client";
import { subscribeSelectedHouseIds } from "@/app/ui/HousesPillsSelector";
import { A, TE } from "@/app/utils/functions";
import {
  BuildXScene,
  createHouseGroupTE,
  localHousesTE,
} from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { memo, useEffect, useRef } from "react";

const MinimalBuildXScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current.parentElement;
    if (!container) return;

    const scene = new BuildXScene({
      canvas: canvasRef.current,
      container: containerRef.current!,
      enableAxesHelper: false,
      enableGestures: false,
      orbitMode: true,
    });

    pipe(
      localHousesTE,
      TE.chain((houses) =>
        pipe(
          houses,
          A.traverse(TE.ApplicativePar)(
            // @ts-ignore
            ({
              houseId,
              systemId,
              friendlyName,
              houseTypeId,
              dnas,
              position: { x, y, z },
              activeElementMaterials,
              rotation,
            }) =>
              pipe(
                {
                  houseId,
                  systemId,
                  friendlyName,
                  houseTypeId,
                  dnas,
                  activeElementMaterials,
                },
                createHouseGroupTE,
                TE.map((houseGroup) => {
                  houseGroup.position.set(x, y, z);
                  houseGroup.rotation.set(0, rotation, 0);
                  scene.addHouseGroup(houseGroup);

                  return houseGroup;
                })
              )
          )
        )
      )
    )();

    const unsubscribeSelectedHouseIds = subscribeSelectedHouseIds(
      (selectedHouseIds) => {
        scene.houses.forEach((house) => {
          house.visible = selectedHouseIds.includes(house.userData.houseId);
        });
      }
    );

    return () => {
      scene.dispose();
      unsubscribeSelectedHouseIds();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
};

export default memo(MinimalBuildXScene);
