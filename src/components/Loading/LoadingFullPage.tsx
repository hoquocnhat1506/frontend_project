import { Spin } from "antd";
import { FC, ReactElement } from "react";

export const LoadingFullPage: FC = (): ReactElement => {
  return (
    <div className="fixed flex h-screen w-screen items-center justify-center">
      <Spin />
    </div>
  );
};
