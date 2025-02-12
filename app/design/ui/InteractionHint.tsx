"use client";
import { useUserAgent } from "@oieduardorabelo/use-user-agent";
import usePortal from "react-cool-portal";

interface InteractionHintProps {
  show: boolean;
}

const InteractionHint = ({ show }: InteractionHintProps) => {
  const { Portal } = usePortal({
    autoRemoveContainer: false,
    internalShowHide: false,
  });
  const userAgent = useUserAgent();
  const isMobile = Boolean(userAgent?.device?.type === "mobile");

  if (!show) return null;

  return (
    <Portal>
      <div className="absolute left-1/2 top-32 z-50 flex -translate-x-1/2 transform justify-center">
        <div className="flex justify-between items-center h-12 min-h-[3rem] rounded-full bg-white px-4 shadow-lg whitespace-nowrap">
          <span className="mx-2 text-sm sm:text-base">
            {isMobile
              ? "Long-tap or double-tap the building to edit"
              : "Right-click or double-click the building to edit"}
          </span>
        </div>
      </div>
    </Portal>
  );
};

export default InteractionHint;
