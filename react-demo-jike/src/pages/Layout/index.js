import { Layout, Menu, Popconfirm } from "antd";
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { fetchUserInfo, clearUserInfo } from "../../store/modules/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const { Header, Sider } = Layout;

const items = [
  {
    label: "首页",
    key: "/",
    icon: <HomeOutlined />,
  },
  {
    label: "文章管理",
    key: "/article",
    icon: <DiffOutlined />,
  },
  {
    label: "创建文章",
    key: "/publish",
    icon: <EditOutlined />,
  },
];

const GeekLayout = () => {
  const location = useLocation();
  const selectedKey = location.pathname;
  const navigate = useNavigate();
  // redux 里面的数据
  const name = useSelector((state) => state.user.userInfo.name);
  const onClick = (e) => {
    console.log(e, "----");
    navigate(e.key);
  };
  const onConfirm = (e) => {
    // navigate(e.key)/;
    dispatch(clearUserInfo);
    console.log("celar");
    navigate("/login");
  };

  const dispatch = useDispatch();
  // 一上来就调用
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{name}</span>
          <span className="user-logout">
            <Popconfirm
              title="是否确认退出？"
              okText="退出"
              cancelText="取消"
              onConfirm={onConfirm}
            >
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={selectedKey}
            items={items}
            onClick={onClick}
            style={{ height: "100%", borderRight: 0 }}
          ></Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
};
export default GeekLayout;
