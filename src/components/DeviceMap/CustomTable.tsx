import React from "react";
import { Table } from "antd";
import { Device } from "../../types";

interface TableProps {
  devices: Device[];
}

const CustomTable: React.FC<TableProps> = ({ devices }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
  ];

  return <Table dataSource={devices} columns={columns} />;
};

export default CustomTable;
