import React from "react";
import CustomTable from "../DeviceMap/CustomTable";
import { Device } from "../../types";

interface WarningProps {
  devices: Device[];
}

const Warning: React.FC<WarningProps> = ({ devices }) => {
  return (
    <div className="warning-container">
      <CustomTable devices={devices} />
    </div>
  );
};

export default Warning;
