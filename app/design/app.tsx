"use client";
import { Add, Reset, View, WatsonHealthSubVolume } from "@carbon/icons-react";
import { useUserAgent } from "@oieduardorabelo/use-user-agent";
import type {
  SceneContextMode,
  ScopeElement,
} from "@opensystemslab/buildx-core";
import {
  BuildXScene,
  createHouseGroupTE,
  defaultCachedHousesOps,
  HouseGroup,
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
import { subscribeKey } from "valtio/utils";
import FullScreenContainer from "~/ui/FullScreenContainer";
import IconButton from "~/ui/IconButton";
import { Menu, SectionCuts, Share } from "~/ui/icons";
import { A, O, R, TE } from "~/utils/functions";
import Loader from "../ui/Loader";
import Radio from "../ui/Radio";
import useSharingWorker from "../utils/workers/sharing/useSharingWorker";
import BuildXContextMenu from "./menu/BuildXContextMenu";
import { sceneState, setBuildXScene } from "./sceneState";
import Breadcrumbs from "./ui/Breadcrumbs";
import Checklist from "./ui/Checklist";
import DeleteProjectMenu from "./ui/DeleteProjectMenu";
import ExitMode from "./ui/ExitMode";
import IconMenu from "./ui/IconMenu";
import RightSideContainer from "./ui/layout/RightSideContainer";
import MetricsWidget from "./ui/metrics/MetricsWidget";
import ObjectsSidebar from "./ui/objects-sidebar/ObjectsSidebar";
import { getModeUrl } from "./util";

const SuspendedApp = () => {
  useSharingWorker();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useSuspendAllBuildData();

  const [contextMenu, setContextMenu] = useState<{
    scopeElement: ScopeElement;
    x: number;
    y: number;
  } | null>(null);

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const [mode, setMode] = useState<SceneContextMode | null>(null);

  const buildingHouseGroupNullable = pipe(
    mode,
    O.fromNullable,
    O.chain((mode) => mode.buildingHouseGroup),
    O.toNullable
  );

  const [elementCategories, setElementCategories] = useState<
    Map<string, boolean>
  >(new Map());

  const [verticalCuts, setVerticalCuts] = useState({
    width: false,
    depth: false,
  });

  useEffect(() => {
    pipe(
      mode,
      O.fromNullable,
      O.chain((mode) => mode.buildingHouseGroup),
      O.map((houseGroup) => {
        houseGroup.managers.cuts?.setXCut(verticalCuts.width);
        houseGroup.managers.cuts?.setZCut(verticalCuts.depth);
        houseGroup.managers.cuts?.createClippedBrushes(houseGroup);
        houseGroup.managers.cuts?.showAppropriateBrushes(
          houseGroup.unsafeActiveLayoutGroup
        );
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verticalCuts]);

  useEffect(() => {
    if (mode === null || O.isNone(mode.buildingHouseGroup)) {
      setVerticalCuts({
        width: false,
        depth: false,
      });
    }
  }, [mode]);

  const [objectsSidebar, setObjectsSidebar] = useState(false);

  const [deleteProjectMenuOpen, setDeleteProjectMenuOpen] = useState(false);

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

  const initializeScene = (
    canvas: HTMLCanvasElement,
    container: HTMLDivElement,
    {
      setContextMenu,
      setMode,
      setElementCategories,
      router,
      userAgent,
    }: {
      setContextMenu: (
        menu: { scopeElement: ScopeElement; x: number; y: number } | null
      ) => void;
      setMode: (mode: SceneContextMode | null) => void;
      setElementCategories: (categories: Map<string, boolean>) => void;
      router: any;
      userAgent: any;
    }
  ) => {
    const contextMenu = (
      scopeElement: ScopeElement,
      xy: { x: number; y: number }
    ): void => {
      const { x, y } = xy;
      setContextMenu({ scopeElement, x, y });
      setMode(scopeElement.elementGroup.scene?.contextManager?.mode ?? null);
    };

    const scene = new BuildXScene({
      canvas,
      container,
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

            prev.buildingHouseGroup.value.managers.cuts?.setXCut(false);
            prev.buildingHouseGroup.value.managers.cuts?.setZCut(false);
            prev.buildingHouseGroup.value.managers.cuts?.createClippedBrushes(
              prev.buildingHouseGroup.value
            );
            prev.buildingHouseGroup.value.managers.cuts?.showAppropriateBrushes(
              prev.buildingHouseGroup.value.unsafeActiveLayoutGroup
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

    setBuildXScene(scene);

    SharingWorkerUtils.createPolygonSubscription((polygon) => {
      sceneState.scene?.updatePolygon(polygon);
    });
  };

  const isLoadingHousesRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeKey(sceneState, "scene", (scene) => {
      if (!scene) return;

      if (isLoadingHousesRef.current) return;

      if (!scene.children.some((x) => x instanceof HouseGroup)) {
        isLoadingHousesRef.current = true;

        pipe(
          localHousesTE,
          TE.chain((houses) => {
            if (houses.length === 0) {
              setObjectsSidebar(true);
              return TE.right(null);
            }

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
                      activeElementMaterials,
                    },
                    createHouseGroupTE,
                    TE.map((houseGroup) => {
                      houseGroup.position.set(x, y, z);
                      houseGroup.rotation.set(0, rotation, 0);
                      sceneState.scene?.addHouseGroup(houseGroup);
                    })
                  )
              )
            );
          })
        )().finally(() => {
          isLoadingHousesRef.current = false;
        });
      }
    });

    return () => {
      unsubscribe();
      isLoadingHousesRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    function cleanup() {
      if (sceneState.scene !== null) {
        sceneState.scene.dispose();
        setBuildXScene(null);
      }
    }

    cleanup();

    if (sceneState.scene === null) {
      initializeScene(canvasRef.current, containerRef.current, {
        setContextMenu,
        setMode,
        setElementCategories,
        router,
        userAgent,
      });
    }

    return cleanup;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { lastSaved } = useProjectData();

  const resetCamera = () => sceneState.scene?.resetCamera();
  const contextUp = () => sceneState.scene?.contextManager?.contextUp();

  const [metricsOpen, setMetricsOpen] = useState(false);

  return (
    <FullScreenContainer>
      <div ref={containerRef} className="w-full h-full">
        <canvas ref={canvasRef} />
      </div>
      <HeaderStartPortal>
        <Breadcrumbs
          mode={mode}
          upMode={() => {
            sceneState.scene?.contextManager?.contextUp();
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
            // onClick={() => setObjectsSidebar(true)}
            aria-label="Add objects"
          >
            <Share />
          </IconButton>
          <IconButton onClick={() => setDeleteProjectMenuOpen(true)}>
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
          <IconButton onClick={resetCamera}>
            <Reset size={24} className="m-auto" />
          </IconButton>
        </IconMenu>

        {buildingHouseGroupNullable && (
          <IconMenu icon={SectionCuts}>
            <Checklist
              label="Vertical cuts"
              options={[
                { value: "width", label: "Width" },
                { value: "depth", label: "Depth" },
              ]}
              selected={pipe(
                verticalCuts,
                R.filter((x) => x),
                R.keys
              )}
              onChange={(selected) => {
                const vcuts = {
                  width: selected.includes("width"),
                  depth: selected.includes("depth"),
                };
                setVerticalCuts(vcuts);
              }}
            />
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
        )}
        {buildingHouseGroupNullable && (
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
                    houseGroup.managers.elements?.setCategories(
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

      <DeleteProjectMenu
        open={deleteProjectMenuOpen}
        close={() => setDeleteProjectMenuOpen(false)}
      />

      {contextMenu && (
        <BuildXContextMenu
          {...contextMenu}
          mode={mode}
          setMode={setMode}
          close={closeContextMenu}
        />
      )}

      <ExitMode mode={mode} upMode={contextUp} />

      <RightSideContainer>
        {!metricsOpen && (
          <IconButton
            onClick={() => setObjectsSidebar(true)}
            className="bg-black py-2"
          >
            <Add size={32} className="m-auto scale-125" color="white" />
          </IconButton>
        )}
        <MetricsWidget
          mode={mode}
          isOpen={metricsOpen}
          setOpen={setMetricsOpen}
        />
      </RightSideContainer>
    </FullScreenContainer>
  );
};

const App = () => (
  <Suspense fallback={<Loader />}>
    <SuspendedApp />
  </Suspense>
);

export default App;
