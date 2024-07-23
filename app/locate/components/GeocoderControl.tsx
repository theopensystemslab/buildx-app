"use client";
import { Search } from "@carbon/icons-react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { polygonTE, useLocatePolygon } from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { useEffect, useRef, useState } from "react";
import usePortal from "react-cool-portal";
import { useMap } from "react-map-gl";
import { useEvent } from "react-use";
import IconButton from "~/ui//IconButton";
import useFlyTo from "../hooks/useFlyTo";
import { dispatchLocateEvent, LocateEvents } from "../state/events";
import css from "./GeocoderControl.module.css";
import { TE } from "@/app/utils/functions";

type Props = {
  leftMenuContainerId: string;
};

const GeocoderControl = (props: Props) => {
  const { leftMenuContainerId } = props;
  const geocoderDiv = useRef<HTMLDivElement>(null);
  const { current: map } = useMap();

  // const polygon = useLocatePolygon();

  const [geocoderEnabled, setGeocoderEnabled] = useState(true);

  useEffect(() => {
    pipe(
      polygonTE,
      TE.map((polygon) => {
        if (polygon !== null) setGeocoderEnabled(false);
        else if (polygon === null) setGeocoderEnabled(true);
      })
    )();
  }, []);

  const hideGeocoder = () => {
    setGeocoderEnabled(false);
  };

  useEvent(LocateEvents.Enum.GeocoderEntered, hideGeocoder);
  useEvent(LocateEvents.Enum.GeocoderClickAway, hideGeocoder);

  const flyTo = useFlyTo();

  useEffect(() => {
    const container = geocoderDiv.current;
    if (!container) return;

    const geocoder = new MapboxGeocoder({
      marker: false,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
      placeholder: "Enter a place name or address",
      // flyTo: true,
    });

    geocoder.addTo(container);

    geocoder.on("result", ({ result }) => {
      if (!map) return;

      flyTo(result.center);

      dispatchLocateEvent(LocateEvents.Enum.GeocoderEntered);

      // setGeocoderEnabled(false)

      // const isGB = result.context.find(
      //   ({ id, short_code }: any) =>
      //     id.includes("country") && short_code === "gb"
      // )

      // if (isGB && siteContext.region !== "UK") siteContext.region = "UK"

      // else if (siteContext.region !== "EU") siteContext.region = "EU"

      // setMode("DRAW")
    });

    return () => {
      container.replaceChildren();
    };
  }, [map, geocoderEnabled, flyTo]);

  const { Portal } = usePortal({
    containerId: leftMenuContainerId,
    autoRemoveContainer: false,
    internalShowHide: false,
  });

  return geocoderEnabled ? (
    <div className={css.root}>
      <div>
        <div className={css.above}>
          <h2>Where do you want to build?</h2>
        </div>
        <div ref={geocoderDiv} className={css.geocoder}></div>
        <div className={css.below}>
          <button
            onClick={() =>
              dispatchLocateEvent(LocateEvents.Enum.GeocoderClickAway)
            }
          >
            or find it on the map
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Portal>
      <IconButton
        //  onClick={() => void setMode("SEARCH")}
        onClick={() => setGeocoderEnabled(true)}
      >
        <div className="flex items-center justify-center">
          <Search size={24} />
        </div>
      </IconButton>
    </Portal>
  );
};

export default GeocoderControl;
