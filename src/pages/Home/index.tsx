import { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  AlertOutlined,
  LineChartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import styles from "./style.module.scss";
import DeviceMap from "../../components/DeviceMap";
import Warning from "../../components/Warning";
import axios from "axios";
import EnvironmentChart from "../../components/EnvironmentChart";

const Home = () => {
  const [selectedSubItem, setSelectedSubItem] = useState<string>("Bản đồ");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/user");
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  console.log("username", username);
  function logout() {
    localStorage.clear();
    window.location.href = "http://localhost:4001/login";
  }

  const items = [
    {
      icon: <UserOutlined />,
      label: username,
      des: "",
      subItems: [],
    },
    {
      icon: <EnvironmentOutlined />,
      label: "Bản đồ",
      des: "",
      subItems: [],
      href: "/map",
    },
    {
      icon: <AlertOutlined />,
      label: "Cảnh báo",
      des: "",
      subItems: [],
      href: "",
    },
    {
      icon: <LineChartOutlined />,
      label: "Biểu đồ",
      des: "",
      subItems: [],
      href: "",
    },
    {
      icon: <ShareAltOutlined />,
      label: "Chia sẻ",
      des: "",
      subItems: [],
      href: "",
    },
  ];

  const handleMenuClick = (label: string) => {
    setSelectedSubItem(label);
  };

  const renderContent = (): JSX.Element | null => {
    switch (selectedSubItem) {
      case "Bản đồ":
        return <DeviceMap />;
      case "Cảnh báo":
        return <Warning />;
      case "Biểu đồ":
        return <EnvironmentChart />;
      default:
        return null;
    }
  };

  return (
    <div className={styles["home-container"]}>
      <div className={classNames("res__menu", styles["res__menu"])}>
        <div
          className={classNames("res__menu-custom", styles["res__menu-custom"])}
        >
          <Menu
            mode="inline"
            style={{ height: "100%", borderRight: 0 }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["1"]}
          >
            {items.map((item, index) => (
              <Menu.Item
                className="submenu-item"
                key={index}
                onClick={() => handleMenuClick(item.label)}
                disabled={index === 0}
                style={{ cursor: "pointer" }}
              >
                <div
                  className={classNames(
                    "submenu-item-main",
                    styles["submenu-item-main"]
                  )}
                >
                  {item.icon}
                  <div className={styles["sub-menu-auther"]}>
                    <p className={styles["sub-title"]}>{item.label}</p>
                  </div>
                </div>
              </Menu.Item>
            ))}
          </Menu>
          <button className="button--logout" onClick={logout}>
            <div className="logout">Đăng xuất</div>
          </button>
        </div>
      </div>
      <div className={styles["device-map-container"]}>{renderContent()}</div>
    </div>
  );
};

export default Home;
