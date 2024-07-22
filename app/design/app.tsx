"use client";
import { Add } from "@carbon/icons-react";
import type {
  SceneContextMode,
  ScopeElement,
} from "@opensystemslab/buildx-core";
import {
  BuildXScene,
  cachedElementsTE,
  cachedHouseTypesTE,
  cachedMaterialsTE,
  cachedModelsTE,
  cachedModulesTE,
  defaultCachedHousesOps,
  houseGroupTE,
  localHousesTE,
} from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { Suspense, useEffect, useRef, useState } from "react";
import usePortal from "react-cool-portal";
import FullScreenContainer from "~/ui/FullScreenContainer";
import IconButton from "~/ui/IconButton";
import { Menu } from "~/ui/icons";
import { A, TE, unwrapTaskEither } from "~/utils/functions";
import BuildXContextMenu from "./menu/BuildXContextMenu";
import ObjectsSidebar from "./ui/objects-sidebar/ObjectsSidebar";
import { suspend } from "suspend-react";
import { sequenceT } from "fp-ts/lib/Apply";
import Loader from "../ui/Loader";

let scene: BuildXScene | null = null;

export const getBuildXScene = (): BuildXScene | null => {
  return scene;
};

const SuspendedApp = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  suspend(
    () =>
      pipe(
        sequenceT(TE.ApplicativeSeq)(
          cachedMaterialsTE,
          // elements depends on materials
          cachedElementsTE,
          cachedModulesTE,
          // models depends on modules
          cachedModelsTE,
          cachedHouseTypesTE
        ),
        unwrapTaskEither
      ),
    ["main"]
  );

  const [contextMenu, setContextMenu] = useState<{
    scopeElement: ScopeElement;
    x: number;
    y: number;
  } | null>(null);

  const closeContextMenu = () => setContextMenu(null);

  const [mode, setMode] = useState<SceneContextMode | null>(null);

  const [objectsSidebar, setObjectsSidebar] = useState(false);

  const [universalMenu, setUniversalMenu] = useState(false);

  const { Portal: HeaderEndPortal } = usePortal({
    containerId: "headerEnd",
    autoRemoveContainer: false,
    internalShowHide: false,
  });

  const { Portal: HeaderStartPortal } = usePortal({
    containerId: "headerStart",
    autoRemoveContainer: false,
    internalShowHide: false,
  });

  useEffect(() => {
    if (!canvasRef.current || scene !== null) return;

    const contextMenu = (
      scopeElement: ScopeElement,
      xy: { x: number; y: number }
    ): void => {
      const { x, y } = xy;

      setContextMenu({
        scopeElement,
        x,
        y,
      });

      setMode(scopeElement.elementGroup.scene.contextManager?.mode ?? null);
      // setSelected(scopeElement)
      // openMenu(x, y)
    };

    scene = new BuildXScene({
      canvas: canvasRef.current,
      ...defaultCachedHousesOps,
      onLongTapBuildElement: contextMenu,
      onRightClickBuildElement: contextMenu,
      onTapMissed: closeContextMenu,
      onModeChange: (_, next) => {
        setMode(next);
      },
    });

    pipe(
      localHousesTE,
      TE.chain((houses) => {
        // this is new
        if (houses.length === 0) setObjectsSidebar(true);

        return pipe(
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
                },
                houseGroupTE,
                TE.map((houseGroup) => {
                  houseGroup.position.set(x, y, z);
                  houseGroup.rotation.set(0, rotation, 0);
                  scene?.addHouseGroup(houseGroup);
                })
              )
          )
        );
      })
    )();
  }, []);

  return (
    <FullScreenContainer>
      <canvas ref={canvasRef} className="w-full h-full" />
      <HeaderEndPortal>
        <div className="flex items-center justify-end">
          <IconButton onClick={() => setObjectsSidebar(true)}>
            <div className="flex items-center justify-center">
              <Add size={32} />
            </div>
          </IconButton>
          <IconButton onClick={() => setUniversalMenu(true)}>
            <Menu />
          </IconButton>
        </div>
      </HeaderEndPortal>

      <ObjectsSidebar
        expanded={objectsSidebar}
        close={() => setObjectsSidebar(false)}
      />

      {/* <UniversalMenu
        open={universalMenu}
        close={() => setUniversalMenu(false)}
      /> */}

      {contextMenu && (
        <BuildXContextMenu
          {...contextMenu}
          mode={mode}
          setMode={setMode}
          close={closeContextMenu}
        />
      )}
    </FullScreenContainer>
  );
};

const App = () => (
  <Suspense fallback={<Loader />}>
    <SuspendedApp />
  </Suspense>
);

export default App;
