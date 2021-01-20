import React, { useRef, useState } from "react";
import ReactMapGL, { InteractiveMap, Layer, Source } from "react-map-gl";

import { Feature } from "../../types";
import mapboxgl from "mapbox-gl";

const Map: React.FC<{ setFeatures: (features: Feature[]) => void; filter: any[] }> = ({
  setFeatures,
  filter,
}) => {
  const ref = useRef<InteractiveMap>(null);
  const [viewport, setViewport] = useState({
    width: 800,
    height: 800,
    latitude: -28.016666,
    longitude: 153.399994,
    zoom: 8,
  });

  const onViewportChange = () => {
    if (ref.current && ref.current.getMap().getLayer("mapLayer")) {
      const visibleFeatures: mapboxgl.MapboxGeoJSONFeature[] = ref.current.queryRenderedFeatures(
        undefined,
        { layers: ["mapLayer"] }
      );

      if (visibleFeatures.length > 0) {
        setFeatures(visibleFeatures as Feature[]);
      }
    }
  };

  return (
    <ReactMapGL
      ref={ref}
      mapStyle="mapbox://styles/mapbox/light-v9"
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onLoad={onViewportChange}
      onViewportChange={(newViewport) => {
        onViewportChange();
        setViewport(newViewport);
      }}
    >
      <Source id="goldCoast" type="geojson" data="./boat_ramps.geojson" tolerance={0.00001} />
      <Layer
        id="mapLayer"
        type="symbol"
        paint={{}}
        layout={{
          "icon-image": "star-11",
          "icon-padding": 0,
          "icon-allow-overlap": true,
        }}
        filter={filter}
        source="goldCoast"
      />
    </ReactMapGL>
  );
};

export { Map };
