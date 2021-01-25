import React, { useRef, useState } from "react";
import ReactMapGL, { InteractiveMap, Layer, Source } from "react-map-gl";

import { Feature } from "../../types";
import { LngLatBounds } from "mapbox-gl";

const Map: React.FC<{
  data: Feature[];
  onBoundsChange: (bounds: LngLatBounds) => void;
}> = ({ data, onBoundsChange }) => {
  const ref = useRef<InteractiveMap>(null);
  const [viewport, setViewport] = useState({
    width: 800,
    height: 800,
    latitude: -28.016666,
    longitude: 153.399994,
    zoom: 8,
  });

  const onLoad = () => {
    if (ref.current) {
      onBoundsChange(ref.current.getMap().getBounds());
    }
  };

  return (
    <ReactMapGL
      ref={ref}
      mapStyle="mapbox://styles/mapbox/light-v9"
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onLoad={onLoad}
      onViewportChange={(newViewport) => {
        onLoad();
        setViewport(newViewport);
      }}
    >
      <Source
        id="goldCoast"
        type="geojson"
        data={{ type: "FeatureCollection", features: data }}
        tolerance={0.00001}
      />
      <Layer
        id="mapLayer"
        type="symbol"
        paint={{}}
        layout={{
          "icon-image": "star-11",
          "icon-padding": 0,
          "icon-allow-overlap": true,
        }}
        source="goldCoast"
      />
    </ReactMapGL>
  );
};

export { Map };
