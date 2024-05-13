import { Form, Input, Button } from "antd";
import styles from "./style.module.scss";

const RegisterForm = () => {
  return (
    <Form name="register" className={styles["register-form"]}>
      <Form.Item name="username">
        <Input placeholder="Username" />
      </Form.Item>

      <Form.Item name="password">
        <Input.Password
          className={styles["pass__fill"]}
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item name="confirm">
        <Input.Password
          className={styles["pass__fill"]}
          placeholder="Confirm Password"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className={styles["btn__click"]}
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
