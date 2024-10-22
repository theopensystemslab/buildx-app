"use client";
import { useUserAgent } from "@oieduardorabelo/use-user-agent";
import { Add, Reset, View, WatsonHealthSubVolume } from "@carbon/icons-react";
import type {
  SceneContextMode,
  ScopeElement,
} from "@opensystemslab/buildx-core";
import {
  BuildXScene,
  createHouseGroupTE,
  defaultCachedHousesOps,
  localHousesTE,
  useProjectData,
  useSuspendAllBuildData,
} from "@opensystemslab/buildx-core";
import { SharingWorkerUtils } from "@opensystemslab/buildx-core/worker-utils";
import { formatDistanceToNow } from "date-fns";
import { pipe } from "fp-ts/lib/function";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import usePortal from "react-cool-portal";
import FullScreenContainer from "~/ui/FullScreenContainer";
import IconButton from "~/ui/IconButton";
import { Menu, SectionCuts } from "~/ui/icons";
import { A, O, R, S, TE } from "~/utils/functions";
import Loader from "../ui/Loader";
import Radio from "../ui/Radio";
import useSharingWorker from "../utils/workers/sharing/useSharingWorker";
import BuildXContextMenu from "./menu/BuildXContextMenu";
import Breadcrumbs from "./ui/Breadcrumbs";
import Checklist from "./ui/Checklist";
import ExitMode from "./ui/ExitMode";
import IconMenu from "./ui/IconMenu";
import MetricsWidget from "./ui/metrics/MetricsWidget";
import ObjectsSidebar from "./ui/objects-sidebar/ObjectsSidebar";
import { getModeUrl } from "./util";

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

  const [elementCategories, setElementCategories] = useState<
    Map<string, boolean>
  >(new Map());

  const [objectsSidebar, setObjectsSidebar] = useState(false);

  const [_universalMenu, setUniversalMenu] = useState(false);

  const [orthographic, setOrthographic] = useState(false);

  const userAgent = useUserAgent();
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

  const router = useRouter();

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
      onModeChange: (prev, next) => {
        setMode(next);
        const url = getModeUrl(next);
        router.push(url);

        if (O.isNone(next.buildingHouseGroup)) {
          setElementCategories(new Map());

          if (O.isSome(prev.buildingHouseGroup)) {
            prev.buildingHouseGroup.value.managers.elements?.setAllElementsVisibility(
              true
            );
          }
        }

        if (O.isNone(prev.buildingHouseGroup)) {
          pipe(
            next.buildingHouseGroup,
            O.map((houseGroup) => {
              setElementCategories(
                houseGroup.managers.elements?.getCategoriesMap() ?? new Map()
              );
            })
          );
        }
      },
      cameraOpts: {
        invertDolly:
          userAgent?.os?.name && ["Mac OS"].includes(String(userAgent.os.name)),
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
  }, [router, userAgent?.os?.name]);

  const { lastSaved } = useProjectData();

  return (
    <FullScreenContainer>
      <canvas ref={canvasRef} className="w-full h-full" />
      <HeaderStartPortal>
        <Breadcrumbs
          mode={mode}
          upMode={() => {
            scene?.contextManager?.contextUp();
          }}
        />
      </HeaderStartPortal>
      <HeaderEndPortal>
        <div className="flex items-center justify-end">
          <div className="text-xs text-gray-600 mr-8 lg:mr-32">
            {lastSaved ? (
              <>
                Last saved:{" "}
                <time dateTime={new Date(lastSaved).toISOString()}>
                  {formatDistanceToNow(new Date(lastSaved), {
                    addSuffix: true,
                  })}
                </time>
              </>
            ) : (
              "Not saved yet"
            )}
          </div>
          <IconButton
            onClick={() => setObjectsSidebar(true)}
            aria-label="Add objects"
          >
            <Add size={24} />
          </IconButton>
          <IconButton onClick={() => setUniversalMenu(true)}>
            <Menu />
          </IconButton>
        </div>
      </HeaderEndPortal>

      <div className="absolute left-0 top-1/2 z-10 flex -translate-y-1/2 transform flex-col justify-center bg-white shadow">
        {/* <IconMenu icon={() => <ChoroplethMap size={24} className="m-auto" />}>
          <Radio
            id="map"
            label="Map"
            options={[
              {
                label: "Disabled",
                value: false,
              },
              {
                label: "Enabled",
                value: true,
              },
            ]}
            selected={mapboxEnabled}
            onChange={setMapboxEnabled}
          />
        </IconMenu> */}
        <IconMenu icon={() => <View size={24} className="m-auto" />}>
          <Radio
            id="camera"
            label="Camera"
            options={[
              {
                label: "Perspective",
                value: false,
              },
              {
                label: "Orthographic",
                value: true,
              },
            ]}
            selected={orthographic}
            onChange={setOrthographic}
          />
          <IconButton onClick={() => scene?.resetCamera()}>
            <Reset size={24} className="m-auto" />
          </IconButton>
        </IconMenu>

        <IconMenu icon={SectionCuts}>
          {/* <Checklist
            label="Vertical cuts"
            options={[
              { value: "width", label: "Width" },
              { value: "length", label: "Length" },
            ]}
            selected={pipe(
              verticalCuts,
              R.filter((x) => x),
              keys
            )}
            onChange={setVerticalCuts}
          /> */}
          {/* <Radio
            id="ground-plane"
            label="Ground Plane"
            options={[
              { value: false, label: "None" },
              { value: true, label: "Regular" },
            ]}
            selected={groundPlane}
            onChange={(newValue) => {
              setGroundPlaneEnabled(newValue);
            }}
          /> */}
        </IconMenu>
        {O.isSome(O.fromNullable(mode?.buildingHouseGroup)) && (
          <IconMenu
            icon={() => <WatsonHealthSubVolume size={24} className="m-auto" />}
          >
            <Checklist
              label="Building elements"
              options={Array.from(elementCategories.entries()).map(
                ([label]) => ({
                  label,
                  value: label,
                })
              )}
              selected={Array.from(elementCategories.entries())
                .filter(([_, value]) => value)
                .map(([key]) => key)}
              onChange={(selectedCategories) => {
                const updatedCategories = new Map(elementCategories);
                elementCategories.forEach((_, key) => {
                  updatedCategories.set(key, selectedCategories.includes(key));
                });
                setElementCategories(updatedCategories);
                pipe(
                  mode,
                  O.fromNullable,
                  O.chain((mode) => mode.buildingHouseGroup),
                  O.map((houseGroup) => {
                    houseGroup.managers?.elements?.setCategories(
                      updatedCategories
                    );
                  })
                );
              }}
            />
          </IconMenu>
        )}
      </div>

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
