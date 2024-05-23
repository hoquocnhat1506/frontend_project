import React, { useEffect, useRef } from "react";
import styles from "./style.module.scss";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression, Map } from "leaflet";
import "leaflet-search/dist/leaflet-search.min.css";
import "leaflet-search";
import iconLocation from "../../assets/svg/iconLocation.png";
import axios from "axios";
import { Device } from "../../types";

interface DeviceMapProps {
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
}

const getCircleOptions = (value: number) => {
  if (value >= 100) {
    return { radius: 200, color: "red", fillColor: "red" };
  } else if (value >= 50) {
    return {
      radius: 150,
      color: "orange",
    };
  } else if (value >= 20) {
    return {
      radius: 100,
      color: "yellow",
      fillColor: "yellow",
    };
  } else {
    return { radius: 50, color: "green", fillColor: "green" };
  }
};

const DeviceMap: React.FC<DeviceMapProps> = ({ setDevices }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const locationInfoRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);

  const fetchDevices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/v1/device");
      const devices: Device[] = response.data.result;
      setDevices(devices);
      devices.forEach((device: Device) => {
        if (mapInstance.current) {
          const circleOptions = getCircleOptions(device.value);
          const circle = L.circle(
            [device.lat, device.long],
            circleOptions
          ).addTo(mapInstance.current);

          const tooltipContent = `
              <div>
                <strong>Name:</strong> ${device.name}<br/>
                <strong>Address:</strong> ${device.address}<br/>
                <strong>Value:</strong> ${device.value} ${device.unit}
              </div>
            `;
          circle.bindTooltip(tooltipContent);
        }
      });
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation: LatLngExpression = [
          position.coords.latitude,
          position.coords.longitude,
        ];

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

          mapInstance.current.on("click", (event: L.LeafletMouseEvent) => {
            const latlng = event.latlng;

            if (locationInfoRef.current) {
              locationInfoRef.current.innerHTML = `Lat: ${latlng.lat}, Long: ${latlng.lng}`;
              locationInfoRef.current.innerHTML += `<img src=${iconLocation} alt="Location Icon" />`;
            }
          });

          fetchDevices();
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
