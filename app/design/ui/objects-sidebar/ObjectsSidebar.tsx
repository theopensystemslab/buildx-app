import { useHouseTypes } from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { Fragment, Suspense } from "react";
import Loader from "~/ui/Loader";
import Sidebar from "~/ui/Sidebar";
import { A } from "~/utils/functions";
import HouseThumbnail from "./HouseThumbnail";

const HouseTypes = (props: { close: () => void }) => {
  const { close } = props;

  const houseTypes = useHouseTypes();
  return (
    <Fragment>
      {pipe(
        houseTypes,
        A.map((houseType) => (
          <HouseThumbnail
            key={houseType.id}
            houseType={houseType}
            close={close}
          />
        ))
      )}
    </Fragment>
  );
};

type Props = {
  expanded: boolean;
  close: () => void;
};

const ObjectsSidebar = (props: Props) => {
  const { expanded, close } = props;

  // NOTE see old sidebar if multi-systeming
  // SiteSidebar in commit older than blame this

  return (
    <Sidebar expanded={expanded} onClose={close}>
      <Suspense fallback={<Loader />}>
        <HouseTypes close={close} />
      </Suspense>
    </Sidebar>
  );
};

export default ObjectsSidebar;
