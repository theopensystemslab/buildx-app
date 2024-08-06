import { Close } from "@carbon/icons-react";
import {
  SceneContextMode,
  SceneContextModeLabel,
} from "@opensystemslab/buildx-core";
import usePortal from "react-cool-portal";

const ExitMode = ({
  mode,
  upMode,
}: {
  mode: SceneContextMode | null;
  upMode: () => void;
}) => {
  const { Portal } = usePortal({
    autoRemoveContainer: false,
    internalShowHide: false,
  });

  return mode === null ||
    mode?.label === SceneContextModeLabel.Enum.SITE ? null : (
    <Portal>
      <div className="absolute left-1/2 top-32 z-50 flex -translate-x-1/2 transform justify-center">
        <button
          onClick={upMode}
          className="flex justify-between items-center h-12 rounded-full bg-white p-2 shadow-lg hover:bg-grey-10"
        >
          <span className="ml-6 mr-2">{`Exit ${mode.label.toLowerCase()}`}</span>
          <span className="w-8 p-1">
            <Close size="24" />
          </span>
        </button>
      </div>
    </Portal>
  );
};

export default ExitMode;
