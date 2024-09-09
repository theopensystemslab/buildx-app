import { ScopeElement } from "@opensystemslab/buildx-core";
import { Fragment } from "react";
import ChangeMaterial from "../common/ChangeMaterial";
import ChangeOpenings from "../common/ChangeOpenings";

type Props = {
  scopeElement: ScopeElement;
  close: () => void;
};
const RowModeContextMenuItems = ({ scopeElement, close }: Props) => {
  return (
    <Fragment>
      <ChangeMaterial scopeElement={scopeElement} close={close} />

      <ChangeOpenings scopeElement={scopeElement} close={close} />

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
