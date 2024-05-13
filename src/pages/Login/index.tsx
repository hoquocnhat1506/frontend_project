import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.scss";
import axiosClient from "../../utils/axiosClient";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("Start login process");
      const response = await axiosClient.post(
        "http://localhost:8000/v1/auth/login",
        {
          username,
          password,
        }
      );
      console.log("Response received:", response.data);
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      navigate("/home");
    } catch (error) {
      console.error("Error:", error);
      message.error("Invalid username or password!");
    }
  };

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className={styles["root"]}>
      <div className={styles["root__main"]}>
        <div className={styles["root__cnt__title"]}>
          <div className={styles["title__name"]}>Welcome Back .!</div>
          <div className={styles["title__skip"]}>
            <div>Skip the lag ?</div>
          </div>
        </div>
        <div className={styles["form__login"]}>
          <Form
            name="basic"
            className={styles["basic__main"]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 480 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <div className={styles["login__name"]}>
              Login <span>Glad you’re back.!</span>
            </div>
            <Form name="login" className={styles["login-form"]}>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  className={styles["pass__fill"]}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </Form.Item>
            </Form>

            <Button
              className={styles["btn__click"]}
              type="primary"
              onClick={handleLogin}
              htmlType="submit"
            >
              Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
