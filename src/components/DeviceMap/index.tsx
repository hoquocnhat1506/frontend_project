import React, { useEffect, useRef } from "react";
import styles from "./style.module.scss";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression, LeafletMouseEvent, Map } from "leaflet";
import "leaflet-search/dist/leaflet-search.min.css";
import "leaflet-search";
import iconLocation from "../../assets/svg/iconLocation.png";

const DeviceMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const newMarkerRef = useRef<L.Marker | null>(null);
  const locationInfoRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null); // Sử dụng Map từ L của Leaflet

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation: LatLngExpression = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        // Kiểm tra xem bản đồ đã được khởi tạo chưa
        if (!mapInstance.current) {
          mapInstance.current = L.map(mapContainer.current!).setView(
            userLocation,
            12
          );

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(mapInstance.current);

          L.control.zoom({ position: "topright" }).addTo(mapInstance.current);

          mapInstance.current.on("click", (event: LeafletMouseEvent) => {
            const latlng = event.latlng;

            if (newMarkerRef.current) {
              mapInstance.current?.removeLayer(newMarkerRef.current);
            }

            const newMarkerIcon = L.icon({
              iconUrl: "http://maps.google.com/mapfiles/ms/micons/blue-dot.png",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            });

            const newMarker = L.marker(latlng, { icon: newMarkerIcon }).addTo(
              mapInstance.current!
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
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

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
