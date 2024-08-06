import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Flex, Layout, Button, ConfigProvider } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import SideMenu from "../components/SideMenu";

const theme = {
  token: {
    //Alias Token
    colorBgContainer: "#303548",
    colorTextBase: "#fff",
  },
};

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
};
const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#0958d9",
};
const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#1677ff",
};
const layoutStyle = {
  minHeight: "100vh",
};
const footerStyle = {};

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Flex>
      <Layout style={layoutStyle}>
        {/* The side Menu */}
        <Sider
          width="15%"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={siderStyle}
        >
          <ConfigProvider theme={theme}>
            <SideMenu />
          </ConfigProvider>
        </Sider>
        <Layout>
          {/* The Header */}
          <Header style={headerStyle}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          {/* The Content */}
          <Content style={contentStyle}>Content</Content>
          {/* The Footer */}
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
      </Layout>
    </Flex>
  );
};

export default Dashboard;
