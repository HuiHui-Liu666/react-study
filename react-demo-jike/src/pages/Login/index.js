import "./index.scss";
import { Card, Form, Input, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogin } from "../../store/modules/user";
import { useNavigate } from "react-router-dom";
const Login = () => {
  // const token = useSelector((state) => state.login.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (obj) => {
    await dispatch(fetchLogin(obj));
    navigate("/");
    message.success("登录成功");
  };
  return (
    <div className="login">
      <Card className="login-container">
        <h2>极客源</h2>
        {/* 登录表单 */}
        <Form validateTrigger="onBlur" onFinish={onFinish}>
          <Form.Item
            name="mobile"
            rules={[
              {
                required: true,
                message: "请输入手机号",
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "请输入正确的手机号",
              },
            ]}
          >
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: "请输入验证码",
              },
            ]}
          >
            <Input size="large" placeholder="请输入验证码:246810" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
