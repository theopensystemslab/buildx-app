import usePortal from "react-cool-portal";
import { Information } from "@carbon/icons-react";

interface InteractionHintProps {
  show: boolean;
}

const InteractionHint = ({ show }: InteractionHintProps) => {
  const { Portal } = usePortal({
    autoRemoveContainer: false,
    internalShowHide: false,
  });

  console.log({ show });

  if (!show) return null;

  return (
    <Portal>
      <div className="absolute left-1/2 top-24 z-50 flex -translate-x-1/2 transform justify-center">
        <div className="flex justify-between items-center h-12 rounded-full bg-white p-2 shadow-lg">
          <span className="w-8 p-1">
            <Information size="24" />
          </span>
          <span className="mx-6">
            Right click or long tap to explore interactions
          </span>
        </div>
      </div>
    </Portal>
  );
};

export default InteractionHint;
