"use client";
import { Fragment, useState } from "react";
import {
  SceneContextMode,
  SceneContextModeLabel,
  useProjectData,
  updateProjectData,
  updateCachedHouse,
} from "@opensystemslab/buildx-core";
import Breadcrumb from "./Breadcrumb";
import RenameForm from "./RenameForm";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";

const Breadcrumbs = ({
  mode,
  upMode,
}: {
  mode: SceneContextMode | null;
  upMode?: () => void;
}) => {
  const { projectName } = useProjectData();
  const [renamingProject, setRenamingProject] = useState(false);
  const [renamingBuilding, setRenamingBuilding] = useState(false);

  const renderBreadcrumbs = () => {
    const breadcrumbs = [];

    // Project breadcrumb
    breadcrumbs.push(
      <Fragment key="project">
        <Breadcrumb
          path="/design"
          label={projectName || "New Project"}
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
              if (newName.length > 0)
                updateProjectData({ projectName: newName });
              setRenamingProject(false);
            }}
          />
        )}
      </Fragment>
    );

    // Building breadcrumb
    if (mode && mode?.label !== SceneContextModeLabel.Enum.SITE) {
      pipe(
        mode.buildingHouseGroup,
        O.fold(
          () => {},
          (houseGroup) => {
            breadcrumbs.push(
              <Fragment key="building">
                <span>/</span>
                <Breadcrumb
                  path={`/design?houseId=${houseGroup.userData.houseId}`}
                  label={houseGroup.friendlyName}
                  onClick={() => {
                    if (mode.label === SceneContextModeLabel.Enum.BUILDING) {
                      setRenamingBuilding(true);
                    } else if (mode.label === SceneContextModeLabel.Enum.ROW) {
                      upMode?.();
                    }
                  }}
                />
                {renamingBuilding && (
                  <RenameForm
                    currentName={houseGroup.friendlyName}
                    onNewName={(newName) => {
                      if (newName.length > 0) {
                        updateCachedHouse(houseGroup.userData.houseId, {
                          friendlyName: newName,
                        });
                      }
                      setRenamingBuilding(false);
                    }}
                  />
                )}
              </Fragment>
            );

            // Level breadcrumb
            if (mode.label === SceneContextModeLabel.Enum.ROW) {
              pipe(
                mode.buildingRowIndex,
                O.fold(
                  () => {},
                  (levelIndex) => {
                    breadcrumbs.push(
                      <Fragment key="level">
                        <span>/</span>
                        <Breadcrumb
                          path={`/design?houseId=${houseGroup.userData.houseId}&levelIndex=${levelIndex}`}
                          label={`Level ${levelIndex}`}
                        />
                      </Fragment>
                    );
                  }
                )
              );
            }
          }
        )
      );
    }

    return breadcrumbs;
  };

  return <>{renderBreadcrumbs()}</>;
};

export default Breadcrumbs;
