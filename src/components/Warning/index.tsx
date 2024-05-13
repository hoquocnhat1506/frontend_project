import { Alert } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const Warning = () => {
  return (
    <Alert
      message="Cảnh báo ngập lụt!"
      description="Mức độ nguy cơ cao. Hãy cẩn thận và thực hiện các biện pháp phòng ngừa."
      type="error"
      showIcon
      icon={<ExclamationCircleOutlined />}
      closable
    />
  );
};

export default Warning;
