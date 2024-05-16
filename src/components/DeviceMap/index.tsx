import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression, LeafletMouseEvent } from "leaflet";
import "leaflet-search";
import iconLocation from "../../assets/svg/iconLocation.png";

const DeviceMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const newMarkerRef = useRef<L.Marker | null>(null);
  const locationInfoRef = useRef<HTMLDivElement | null>(null);
  const [mapInitCount, setMapInitCount] = useState(0);

  useEffect(() => {
    let map: L.Map | null = null;

    if (mapContainer.current && mapInitCount === 0) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation: LatLngExpression = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        map = L.map(mapContainer.current!).setView(userLocation, 12);

        L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
          attribution: "&copy; Google Maps",
        }).addTo(map!);

        L.control.zoom({ position: "topright" }).addTo(map!);

        map.on("click", (event: LeafletMouseEvent) => {
          const latlng = event.latlng;

          if (newMarkerRef.current) {
            map?.removeLayer(newMarkerRef.current);
          }

          const newMarkerIcon = L.icon({
            iconUrl: "http://maps.google.com/mapfiles/ms/micons/blue-dot.png",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          const newMarker = L.marker(latlng, { icon: newMarkerIcon }).addTo(
            map!
          );
          newMarkerRef.current = newMarker;

          if (locationInfoRef.current) {
            locationInfoRef.current.innerHTML = `Lat: ${latlng.lat}, Long: ${latlng.lng}`;
            const iconLocationElement = document.createElement("img");
            iconLocationElement.src = iconLocation;
            iconLocationElement.alt = "Location Icon";
            locationInfoRef.current.appendChild(iconLocationElement);
          }
        });

        setMapInitCount(1);
      });
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapInitCount]);

  return (
    <div className={styles["map"]}>
      <div ref={mapContainer} style={{ height: "100vh" }} />

      <div className={styles["box-location"]}>
        <div
          className={styles["box-location__main"]}
          ref={locationInfoRef}
          style={{ marginTop: "10px", fontSize: "16px" }}
        ></div>
      </div>
    </div>
  );
};

export default DeviceMap;
