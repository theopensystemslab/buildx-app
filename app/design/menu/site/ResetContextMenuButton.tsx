import { Reset } from "@carbon/icons-react";
import { ScopeElement } from "@opensystemslab/buildx-core";
import ContextMenuButton from "../common/ContextMenuButton";

type Props = {
  scopeElement: ScopeElement;
  close: () => void;
};
const ResetContextMenuButton = ({ scopeElement, close }: Props) => {
  const resetHouse = async () => {
    scopeElement.elementGroup.houseGroup.managers.layouts.resetToHouseTypeLayoutGroup();

    close();
  };

  return (
    <ContextMenuButton
      icon={<Reset size={20} />}
      text="Reset"
      onClick={resetHouse}
    />
  );
};

export default ResetContextMenuButton;
