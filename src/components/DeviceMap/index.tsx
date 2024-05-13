import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression, LeafletMouseEvent } from "leaflet";
import "leaflet-search/dist/leaflet-search.min.css";
import "leaflet-search";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import iconLocation from "../../assets/svg/iconLocation.png";

const DeviceMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const newMarkerRef = useRef<L.Marker | null>(null);
  const locationInfoRef = useRef<HTMLDivElement | null>(null);
  const [selectedPosition, setSelectedPosition] =
    useState<LatLngExpression | null>(null);
  const [alertCircles, setAlertCircles] = useState<L.Circle[]>([]);
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
        }).addTo(map);

        L.control.zoom({ position: "topright" }).addTo(map);

        const geocoder = L.Control.Geocoder.nominatim();
        const geocoderControl = L.Control.geocoder({
          geocoder: geocoder,
          collapsed: false,
          placeholder: "Search for a location...",
        }).addTo(map);

        geocoderControl.on("markgeocode", function (event: any) {
          const { center, name, properties } = event.geocode;

          if (newMarkerRef.current) {
            map?.removeLayer(newMarkerRef.current);
          }

          const newMarkerIcon = L.icon({
            iconUrl: "http://maps.google.com/mapfiles/ms/micons/blue-dot.png",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          const newMarker = L.marker(center, { icon: newMarkerIcon }).addTo(
            map!
          );
          newMarkerRef.current = newMarker;

          const { city, state, country } = properties;
          const locationInfo = `<b>Name:</b> ${name}<br><b>City:</b> ${
            city || "N/A"
          }<br><b>State:</b> ${state || "N/A"}<br><b>Country:</b> ${
            country || "N/A"
          }`;

          if (locationInfoRef.current) {
            locationInfoRef.current.innerHTML = locationInfo;
            const iconLocationElement = document.createElement("img");
            iconLocationElement.src = iconLocation;
            iconLocationElement.alt = "Location Icon";
            locationInfoRef.current.appendChild(iconLocationElement);
          }
        });

        map.on("click", (event: LeafletMouseEvent) => {
          const latlng = event.latlng;
          setSelectedPosition(latlng);

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

          alertCircles.forEach((circle) => {
            map?.removeLayer(circle);
          });

          // Draw new alert circles
          const radius = 100; // 1km radius
          const step = radius / 1;
          const latLngs = [];

          const measurement = 50; // đo mực nước: 50 cm
          const colorsByMeasurement = getColorByMeasurement(measurement);

          for (let i = 0; i < 1; i++) {
            const color = colorsByMeasurement[i];
            const circle = L.circle(latlng, {
              color: color,
              fillColor: color,
              fillOpacity: 0.2,
              radius: (i + 1) * step,
            }).addTo(map!);
            latLngs.push(circle);
          }

          setAlertCircles(latLngs);
        });

        setMapInitCount(1);
      });
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [alertCircles, mapInitCount]);

  // Function to get color based on measurement
  const getColorByMeasurement = (measurement: number): string[] => {
    const colors: string[] = [];
    if (measurement <= 5) {
      colors.push("lightblue");
    } else if (measurement <= 30) {
      colors.push("yellow");
    } else {
      colors.push("red");
    }
    colors.push("yellow");
    colors.push("red");
    return colors;
  };

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
