import { ScopeElement } from "@opensystemslab/buildx-core";
import { Fragment } from "react";
import ChangeMaterial from "../common/ChangeMaterial";
import ChangeWindows from "../common/ChangeWindows";

type Props = {
  scopeElement: ScopeElement;
  close: () => void;
};
const RowModeContextMenuItems = ({ scopeElement }: Props) => {
  return (
    <Fragment>
      <ChangeMaterial scopeElement={scopeElement} close={close} />

      <ChangeWindows scopeElement={scopeElement} close={close} />

      {/* <ChangeLevelType
        close={close}
        houseTransformsGroup={houseGroup}
        scopeElement={scopeElement}
      /> */}

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

export default RowModeContextMenuItems;
