import { GoogleMap, Marker } from "@react-google-maps/api";
import React, { useMemo } from "react";
import { LatLng } from "use-places-autocomplete";

type Props = {
  selected?: LatLng | undefined;
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

const Map = ({ selected }: Props) => {
  const center = useMemo(() => ({ lat: 10.771595, lng: 106.7013516 }), []);
  return (
    <GoogleMap zoom={15} center={selected === undefined ? center : selected} mapContainerStyle={containerStyle}>
      {selected && <Marker position={selected} />}
    </GoogleMap>
  );
};

export default Map;
