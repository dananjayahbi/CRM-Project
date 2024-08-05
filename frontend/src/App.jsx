import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const location = useLocation();
  const isLogged = window.sessionStorage.getItem("LoggedIn");
  const Base_Backend_URL = "http://localhost:3000";

  //-------------------------------------

  //clear local storage
  // window.sessionStorage.clear();

  //force login
  // window.sessionStorage.setItem("LoggedIn", true);

  //-------------------------------------

  //Check if any user in the database and if not create defaultAdmin
  const createDefaultAdmin = async () => {
    const response = await axios.get(
      `${Base_Backend_URL}/api/users/getAllUsers`
    );
    if (response.status === 200) {
      if (response.data.length === 0) {
        const response = await axios.post(
          `${Base_Backend_URL}/api/users/createDefaultAdmin`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          console.log("Default Super-Admin Created");
        } else {
          console.log("Default Super-Admin already exists");
        }
      }
    }
  };

  useEffect(() => {
    createDefaultAdmin();
  }, []);

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
