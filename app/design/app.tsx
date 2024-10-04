"use client";
import { Add } from "@carbon/icons-react";
import type {
  SceneContextMode,
  ScopeElement,
} from "@opensystemslab/buildx-core";
import {
  BuildXScene,
  createHouseGroupTE,
  defaultCachedHousesOps,
  localHousesTE,
  useSuspendAllBuildData,
} from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { Suspense, useEffect, useRef, useState } from "react";
import usePortal from "react-cool-portal";
import FullScreenContainer from "~/ui/FullScreenContainer";
import IconButton from "~/ui/IconButton";
import { Menu } from "~/ui/icons";
import { A, TE } from "~/utils/functions";
import Loader from "../ui/Loader";
import BuildXContextMenu from "./menu/BuildXContextMenu";
import ObjectsSidebar from "./ui/objects-sidebar/ObjectsSidebar";
import useSharingWorker from "../utils/workers/sharing/useSharingWorker";
import { SharingWorkerUtils } from "@opensystemslab/buildx-core/worker-utils";
import ExitMode from "./ui/ExitMode";
import MetricsWidget from "./ui/metrics/MetricsWidget";
import Breadcrumbs from "./ui/Breadcrumbs";

let scene: BuildXScene | null = null;

export const getBuildXScene = (): BuildXScene | null => {
  return scene;
};

const SuspendedApp = () => {
  useSharingWorker();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useSuspendAllBuildData();

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

    SharingWorkerUtils.createPolygonSubscription((polygon) => {
      scene?.updatePolygon(polygon);
    });

    pipe(
      localHousesTE,
      TE.chain((houses) => {
        // this is new
        if (houses.length === 0) setObjectsSidebar(true);

        return pipe(
          houses,
          A.traverse(TE.ApplicativePar)(
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
                createHouseGroupTE,
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
      <HeaderStartPortal>
        <Breadcrumbs mode={mode} upMode={scene?.contextManager?.contextUp} />
      </HeaderStartPortal>
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

      <ExitMode
        mode={mode}
        upMode={() => {
          scene?.contextManager?.contextUp();
        }}
      />

      <MetricsWidget mode={mode} />
    </FullScreenContainer>
  );
};

const App = () => (
  <Suspense fallback={<Loader />}>
    <SuspendedApp />
  </Suspense>
);

export default App;
