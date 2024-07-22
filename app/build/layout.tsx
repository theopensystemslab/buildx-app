import { PropsWithChildren } from "react";
import BuildNav from "./common/BuildNav";
import dynamic from "next/dynamic";

const HousePillsSelector = dynamic(
  () => import("~/analyse/ui/HousePillsSelector"),
  {
    ssr: false,
  }
);

const BuildLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="flex-auto overflow-y-auto flex flex-col">
      <div className="flex-1 flex-grow-0">
        <HousePillsSelector />
      </div>
      <div className="flex flex-auto h-full overflow-y-auto">
        <div className="flex-1 flex-grow-0 flex-shrink-0 h-full">
          <BuildNav />
        </div>
        <div className="flex-auto border-l border-grey-20">{children}</div>
      </div>
    </div>
  );
};

export default BuildLayout;
