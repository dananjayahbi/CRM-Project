import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button, ConfigProvider, Menu, Dropdown } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import SideMenu from "../components/SideMenu";
import DashboardContent from "../pages/DashboardContent";
import Users from "../pages/Users";

const theme = {
  token: {
    // Alias Token
    colorBgContainer: "#303548",
    colorTextBase: "#fff",
  },
};

const headerStyle = {
  color: "#111",
  height: 80,
  lineHeight: "64px",
  padding: "0 25px 0 0",
  backgroundColor: "#ebebeb",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#111",
  backgroundColor: "#f6f7fb",
};
const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#111",
  backgroundColor: "#000",
};
const layoutStyle = {
  minHeight: "100vh",
};
const footerStyle = {};

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  //Get the window inner width realtime
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWidth(width);
    if (width < 1000) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [window.innerWidth]);

  const handleLogout = () => {
    //clear the session storage
    sessionStorage.clear();
    //redirect to login page
    window.location.href = "/login";
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">User: "The username"</Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <ConfigProvider theme={theme}>
      <Layout style={layoutStyle}>
        {/* The side Menu */}
        <Sider
          width={width < 1000 ? "250px" : "18%"}
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={siderStyle}
        >
          <SideMenu />
        </Sider>
        <Layout>
          {/* The Header */}
          <Header style={headerStyle}>
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ color: "#000" }} />
                ) : (
                  <MenuFoldOutlined style={{ color: "#000" }} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Dropdown overlay={menu} trigger={["click"]}>
              <div
                style={{
                  display: !collapsed && width < 1000 ? "none" : "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <img
                  src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                  alt="Profile Image"
                  width={40}
                  height={40}
                  style={{
                    borderRadius: "50%",
                    marginRight: 10,
                  }}
                />
              </div>
            </Dropdown>
          </Header>
          {/* The Content (Routes for the inner pages)*/}
          <Content style={contentStyle}>
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </Content>
          {/* The Footer */}
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Dashboard;
