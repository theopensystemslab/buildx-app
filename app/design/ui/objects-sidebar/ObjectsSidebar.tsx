import { buildSystems, CachedHouseType } from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { Fragment } from "react";
import Sidebar from "~/ui/Sidebar";
import { A, NEA } from "~/utils/functions";
import HouseThumbnail from "./HouseThumbnail";

const HouseTypes = (props: {
  close: () => void;
  houseTypes: CachedHouseType[];
}) => {
  const { close, houseTypes } = props;

  const houseTypesBySystem = pipe(
    houseTypes,
    NEA.groupBy((houseType) => houseType.systemId)
  );

  return (
    <div className="divide-y divide-grey-40">
      {buildSystems.map((system) => (
        <Fragment key={system.id}>
          {houseTypesBySystem[system.id] && (
            <div className="py-3">
              <h3 className="px-4 mb-3 text-xl font-bold text-gray-900">
                {system.name}
              </h3>
              <div className="space-y-2 divide-y">
                {pipe(
                  houseTypesBySystem[system.id],
                  A.map((houseType) => (
                    <HouseThumbnail
                      key={houseType.id}
                      houseType={houseType}
                      close={close}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

type Props = {
  expanded: boolean;
  close: () => void;
  houseTypes: CachedHouseType[];
};

const ObjectsSidebar = (props: Props) => {
  const { expanded, close, houseTypes } = props;

  console.log(houseTypes);

  return (
    <Sidebar expanded={expanded} onClose={close}>
      <HouseTypes houseTypes={houseTypes} close={close} />
    </Sidebar>
  );
};

export default ObjectsSidebar;
