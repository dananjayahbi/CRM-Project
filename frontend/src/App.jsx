import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { ConfigProvider } from "antd";
import LoginMobile from "./pages/LoginMobile";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const isLogged = window.sessionStorage.getItem("LoggedIn");

  const theme = {
    token: {
      // Seed Token
      colorPrimary: "#4e97fd",

      // Alias Token
      colorBgContainer: "#fff",
    },
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1300);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1300);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <Routes>
        {isLogged ? (
          <>
            <Route path="*" element={<Dashboard />} />
          </>
        ) : (
          <>
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
        <Route path="/login" element={isMobile ? <LoginMobile /> : <Login />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
