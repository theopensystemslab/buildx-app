import { pipe } from "fp-ts/lib/function";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { O, R } from "../../utils/functions";
import Breadcrumb from "./Breadcrumb";
import RenameForm from "./RenameForm";
import {
  House,
  SceneContextMode,
  SceneContextModeLabel,
  useHouses,
  useProjectData,
  updateProjectData,
  housesToRecord,
  updateCachedHouse,
} from "@opensystemslab/buildx-core";
import { useSearchParams } from "next/navigation";

const BreadcrumbsWithParams = (props: {
  houses: House[];
  houseId?: string;
  rowIndex?: string;
  mode: SceneContextMode | null;
  upMode?: () => void;
}) => {
  const { houseId, rowIndex: levelIndex, houses, mode, upMode } = props;

  const [renamingBuilding, setRenamingBuilding] = useState(false);

  return pipe(
    houseId,
    O.fromNullable,
    O.chain((houseId) =>
      pipe(
        houses,
        housesToRecord,
        R.lookup(houseId),
        O.map((house): JSX.Element => {
          const { friendlyName } = house;

          return (
            <Fragment key={friendlyName}>
              <span>{`/`}</span>
              <Breadcrumb
                path={`/design?houseId=${houseId}`}
                label={friendlyName}
                onClick={() => {
                  switch (mode?.label) {
                    case SceneContextModeLabel.Enum.BUILDING:
                      setRenamingBuilding(true);
                      break;
                    case SceneContextModeLabel.Enum.ROW:
                      upMode?.();
                      break;
                  }
                }}
              />
              {renamingBuilding && (
                <RenameForm
                  currentName={friendlyName}
                  onNewName={(newName) => {
                    if (newName.length > 0) {
                      updateCachedHouse(houseId, { friendlyName: newName });
                    }
                    setRenamingBuilding(false);
                  }}
                />
              )}
              {pipe(
                levelIndex,
                O.fromNullable,
                O.match(
                  () => null,
                  (levelIndex) => (
                    <Fragment>
                      <span>{`/`}</span>
                      <Breadcrumb
                        path={`/design?houseId=${houseId}&levelIndex=${levelIndex}`}
                        label={`Level ${levelIndex}`}
                      />
                    </Fragment>
                  )
                )
              )}
            </Fragment>
          );
        })
      )
    ),
    O.getOrElse(() => <></>)
  );
};

const Breadcrumbs = ({
  mode,
  upMode,
}: {
  mode: SceneContextMode | null;
  upMode?: () => void;
}) => {
  const searchParams = useSearchParams();

  const houseId = searchParams.get("houseId");
  const rowIndex = searchParams.get("levelIndex");

  console.log({ houseId });

  const houses = useHouses();

  const { projectName } = useProjectData();

  const [renamingProject, setRenamingProject] = useState(false);

  return (
    <Fragment>
      <Breadcrumb
        path={`/design`}
        label={
          projectName === null || projectName.length === 0
            ? `New Project`
            : projectName
        }
        onClick={() => {
          if (mode?.label !== SceneContextModeLabel.Enum.SITE) {
            upMode?.();
          } else if (!renamingProject) {
            setRenamingProject(true);
          }
        }}
      />
      {renamingProject && (
        <RenameForm
          currentName={projectName}
          onNewName={(newName) => {
            if (newName.length > 0) updateProjectData({ projectName: newName });

            setRenamingProject(false);
          }}
        />
      )}
      {mode?.label !== SceneContextModeLabel.Enum.SITE && houseId && (
        <BreadcrumbsWithParams
          {...{
            houseId: houseId ?? undefined,
            rowIndex: rowIndex ?? undefined,
            houses,
            mode,
            upMode,
          }}
        />
      )}
    </Fragment>
  );
};

export default Breadcrumbs;
