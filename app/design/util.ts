import {
  SceneContextMode,
  SceneContextModeLabel,
} from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/function";
import { O } from "../utils/functions";

export const getProjectUrl = () => "/design";

export const getBuildingUrl = (houseId: string) => `/design?houseId=${houseId}`;

export const getLevelUrl = (houseId: string, levelIndex: number) =>
  `/design?houseId=${houseId}&levelIndex=${levelIndex}`;

export const getModeUrl = (mode: SceneContextMode): string => {
  if (mode.label === SceneContextModeLabel.Enum.SITE) {
    return getProjectUrl();
  }

  return pipe(
    mode.buildingHouseGroup,
    O.fold(
      () => getProjectUrl(),
      (houseGroup) => {
        if (mode.label === SceneContextModeLabel.Enum.BUILDING) {
          return getBuildingUrl(houseGroup.userData.houseId);
        }
        if (mode.label === SceneContextModeLabel.Enum.ROW) {
          return pipe(
            mode.buildingRowIndex,
            O.fold(
              () => getBuildingUrl(houseGroup.userData.houseId),
              (levelIndex) =>
                getLevelUrl(houseGroup.userData.houseId, levelIndex)
            )
          );
        }
        return getProjectUrl();
      }
    )
  );
};
