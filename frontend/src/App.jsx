import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const isLogged = window.sessionStorage.getItem("LoggedIn");

  //-------------------------------------

  //clear local storage
  // window.sessionStorage.clear();

  //force login
  // window.sessionStorage.setItem("LoggedIn", true);

  //-------------------------------------

  return (
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
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
