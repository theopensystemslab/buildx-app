import { ScopeElement } from "@opensystemslab/buildx-core";
import { Fragment } from "react";
import { Pencil } from "~/ui/icons";
import ChangeOpenings from "../common/ChangeOpenings";
import ContextMenuButton from "../common/ContextMenuButton";
import ChangeMaterial from "../common/ChangeMaterial";
import ChangeLevelType from "./ChangeLevelType";

type Props = {
  scopeElement: ScopeElement;
  close: () => void;
};
const BuildingModeContextMenuItems = ({ scopeElement, close }: Props) => {
  const { elementGroup } = scopeElement;

  return (
    <Fragment>
      <ContextMenuButton
        icon={<Pencil />}
        text="Edit level"
        unpaddedSvg
        onClick={() => {
          elementGroup.scene?.contextManager?.contextDown(elementGroup);
        }}
      />

      <ChangeMaterial scopeElement={scopeElement} close={close} />

      <ChangeOpenings scopeElement={scopeElement} close={close} />

      <ChangeLevelType scopeElement={scopeElement} close={close} />

      {/* <AddRemoveLevels
        {...{
          houseId,
          columnIndex,
          levelIndex,
          gridGroupIndex,
          onComplete: props.onClose,
        }}
      /> */}
    </Fragment>
  );
};

export default BuildingModeContextMenuItems;
