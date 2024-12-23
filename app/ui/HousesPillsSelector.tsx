"use client";
import { Close } from "@carbon/icons-react";
import { House, housesToRecord, useHouses } from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { proxy, useSnapshot } from "valtio";
import {
  buildingColorVariants,
  getColorClass,
  staleColorVariants,
} from "../analyse/ui/colors";
import { A, Ord, R, S } from "../utils/functions";
import { subscribeKey } from "valtio/utils";

const store = proxy<{
  selectedHouseIds: string[];
}>({
  selectedHouseIds: [],
});

export const useSelectedHouseIds = (): string[] => {
  const { selectedHouseIds } = useSnapshot(store) as typeof store;
  return selectedHouseIds;
};

export const subscribeSelectedHouseIds = (
  fn: (selectedHouseIds: string[]) => void
) => {
  return subscribeKey(store, "selectedHouseIds", fn);
};

export const useSelectedHouses = () => {
  const selectedHouseIds = useSelectedHouseIds();
  const houses = useHouses();

  return useMemo(
    () =>
      pipe(
        houses,
        A.filter((k) => selectedHouseIds.includes(k.houseId))
      ),
    [houses, selectedHouseIds]
  );
};

const sortHousesByFriendlyName = A.sort(
  pipe(
    S.Ord,
    Ord.contramap((x: House) => x.friendlyName)
  )
);

const Level2 = ({ selectedHouses }: { selectedHouses: House[] }) => {
  const houses = useHouses();
  const allHouseIds = houses.map((x) => x.houseId);

  const orderedSelectedHouses = useMemo(() => {
    return houses.filter((house) =>
      selectedHouses.some(
        (selectedHouse) => selectedHouse.houseId === house.houseId
      )
    );
  }, [houses, selectedHouses]);

  const selectedHouseIds = pipe(
    selectedHouses,
    A.map((x) => x.houseId)
  );

  const houseSelectOptions: { houseId: string; houseName: string }[] = houses
    .map((house) =>
      selectedHouseIds.includes(house.houseId)
        ? null
        : {
            houseId: house.houseId,
            houseName: house.friendlyName,
          }
    )
    .filter((v): v is { houseId: string; houseName: string } => Boolean(v));

  const [expanded, setExpanded] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const closeDropdown = useCallback(() => {
    setExpanded(false);
  }, [setExpanded]);

  useClickAway(dropdownRef, closeDropdown);

  return (
    <div className="flex flex-wrap items-center space-x-2 px-4 py-1.5 border-b">
      {orderedSelectedHouses.map((house) => {
        const { houseId } = house;

        const colorClass = getColorClass(allHouseIds, houseId);

        return (
          <p
            key={houseId}
            className={`inline-flex items-center space-x-1 overflow-hidden rounded-full ${colorClass}`}
          >
            <span className="inline-block py-1 pl-3 text-sm font-semibold tracking-wide">
              {house.friendlyName}
            </span>
            <button
              className="h-8 w-8 p-0.5 transition-colors duration-200 hover:bg-[rgba(0,0,0,0.05)]"
              onClick={() => {
                store.selectedHouseIds = store.selectedHouseIds.filter(
                  (id) => id !== houseId
                );
              }}
            >
              <Close />
            </button>
          </p>
        );
      })}

      {houseSelectOptions.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <button
            className="w-10 py-1 text-center text-2xl leading-none text-grey-40 transition-colors duration-200 hover:text-white"
            onClick={() => {
              setExpanded((prev) => !prev);
            }}
          >
            +
          </button>

          {expanded && (
            <div
              className={`absolute -bottom-1 z-40 w-40 translate-y-full transform overflow-hidden rounded bg-white shadow-lg ${
                selectedHouseIds.length > 0 ? "right-0" : "left-0"
              }`}
            >
              {houseSelectOptions.map((houseSelectOption) => (
                <button
                  className="block w-full px-4 py-2 text-left transition-colors duration-200 hover:bg-gray-100"
                  key={houseSelectOption.houseId}
                  onClick={() => {
                    store.selectedHouseIds = [
                      ...store.selectedHouseIds,
                      houseSelectOption.houseId,
                    ];
                  }}
                  value={houseSelectOption.houseName}
                >
                  {houseSelectOption.houseName}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Level1 = () => {
  const { selectedHouseIds } = useSnapshot(store) as typeof store;

  const housesRecord = housesToRecord(useHouses());

  const serial = selectedHouseIds.join(",");

  const props = useMemo(
    () => ({
      selectedHouses: pipe(
        selectedHouseIds,
        A.filterMap((houseId) => pipe(housesRecord, R.lookup(houseId)))
      ),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serial]
  );

  return <Level2 {...props} />;
};

const HousesPillsSelector = () => {
  const houses = useHouses();

  useEffect(() => {
    const sortedHouses = pipe(houses, sortHousesByFriendlyName);
    store.selectedHouseIds = sortedHouses.map((x) => x.houseId);
  }, [houses]);

  return <Level1 />;
};

export default HousesPillsSelector;
