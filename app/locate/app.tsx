"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGLMap from "react-map-gl";
import HtmlPortalContainer from "~/ui/HtmlPortalContainer";
import GeocoderControl from "./components/GeocoderControl";
import css from "./app.module.css";
import PolygonControl from "./components/PolygonControl";
import useSharingWorker from "../utils/workers/sharing/useSharingWorker";

const gadheim = {
  longitude: 9.902056,
  latitude: 49.843,
};

const Locate = () => {
  useSharingWorker();

  const leftMenuContainerId = "left-menu-container";
  const topLeftContainerId = "top-left-container-id";
  const bottomRightContainerId = "bottom-right-container-id";

  return (
    <div className="w-full h-full relative">
      <ReactMapGLMap
        initialViewState={{
          ...gadheim,
          zoom: 3,
        }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
        reuseMaps
      >
        <GeocoderControl {...{ leftMenuContainerId }} />
        <PolygonControl
          {...{
            leftMenuContainerId,
            topLeftContainerId,
            bottomRightContainerId,
          }}
        />
      </ReactMapGLMap>

      <HtmlPortalContainer
        id={topLeftContainerId}
        className={css.topLeftContainer}
      />

      <div className={css.leftMenuContainer}>
        <HtmlPortalContainer id={leftMenuContainerId} />
      </div>

      <HtmlPortalContainer
        id={bottomRightContainerId}
        className={css.bottomRightContainer}
      />
    </div>
  );
};

export default Locate;
