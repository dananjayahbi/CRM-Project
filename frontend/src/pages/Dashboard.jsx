import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button, ConfigProvider, Menu, Dropdown } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import SideMenu from "../components/SideMenu";
import DashboardContent from "../pages/DashboardContent";
import Users from "../pages/Users/Users";
import Customers from "./Customers/Customers";
import Suppliers from "./Suppliers/Suppliers";
import Units from "./Units/Units";
import PaymentTypes from "./PaymentTypes/PaymentTypes";
import Tax from "./Tax/Tax";
import ProductsCategory from "./ProductsCategory/ProductsCategory";

const theme = {
  token: {
    // Alias Token
    colorBgContainer: "#303548",
    colorTextBase: "#fff",
    colorBgElevated: "#444c67",
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
  justifyContent: window.innerWidth < 1000 ? "flex-end" : "space-between",
};
const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#111",
  backgroundColor: "#f6f7fb",
  margin: "20px",
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
  const [collapsed, setCollapsed] = useState(true);
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
    <>
      <Layout style={layoutStyle}>
        <ConfigProvider theme={theme}>
          {/* The side Menu */}
          <Sider
            width={width < 1655 ? 300 : width < 1024 ? 200 : 256}
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={siderStyle}
          >
            <SideMenu />
          </Sider>
        </ConfigProvider>
        <Layout>
          <ConfigProvider theme={theme}>
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
                  display: width < 1000 ? "none" : "block",
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              <Dropdown overlay={menu} trigger={["click"]}>
                <div
                  style={{
                    display: !collapsed && width < 1000 ? "none" : "flex",
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
          </ConfigProvider>
          {/* The Content (Routes for the inner pages)*/}
          <Content style={contentStyle}>
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/users" element={<Users />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/settings/units" element={<Units />} />
              <Route
                path="/settings/payment-types"
                element={<PaymentTypes />}
              />
              <Route path="/settings/tax" element={<Tax />} />
              <Route
                path="/products/products-category"
                element={<ProductsCategory />}
              />
            </Routes>
          </Content>
          {/* The Footer */}
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;
