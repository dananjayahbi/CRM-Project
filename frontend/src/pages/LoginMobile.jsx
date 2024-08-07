import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import Logo from "../assets/logo.png";

const LoginMobile = () => {
  const createAdminCalled = useRef(false); // useRef to keep track of function call
  const backgroundImage =
    "https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  //Check if any user in the database and if not create defaultAdmin
  const createDefaultAdmin = async () => {
    if (createAdminCalled.current) return; // Prevent function from running if already called
    createAdminCalled.current = true; // Mark as called

    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/getAllUsers`
      );
      if (response.status === 200) {
        if (response.data.length === 0) {
          const response = await axios.post(
            `http://localhost:3000/api/users/createDefaultAdmin`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 201) {
            message.success("Default Super-Admin Created");
          } else {
            message.info("Default Super-Admin already exists");
          }
        }
      }
    } catch (error) {
      message.error("Failed to create default admin!");
    }
  };

  useEffect(() => {
    createDefaultAdmin();
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        values
      );
      if (response.status === 200) {
        message.success("Login successful!");
        window.sessionStorage.setItem("LoggedIn", true);
        window.sessionStorage.setItem("user", JSON.stringify(response.data));
        window.location.href = "/";
      } else {
        message.error("Login failed! Please check your credentials.");
      }
    } catch (error) {
      message.error("Login failed! Something went wrong!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          border: "1px solid #dadce0",
          borderRadius: "25px",
          width: "400px",
          height: "500px",
          padding: "20px",
          backgroundColor: "#fff",
          margin: "0 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <img
            src={Logo}
            alt="logo"
            style={{ width: "150px", marginBottom: "20px" }}
          />
          <span
            style={{
              color: "#3c4043",
              fontFamily: "Roboto, sans-serif",
              fontSize: "30px",
              fontWeight: 500,
            }}
          >
            Sign in
          </span>{" "}
          <br /> <br />
          <Form
            name="login"
            layout="vertical"
            style={{ width: "100%" }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <a
            href="/"
            style={{ color: "#1a73e8", fontFamily: "Roboto, sans-serif" }}
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginMobile;
