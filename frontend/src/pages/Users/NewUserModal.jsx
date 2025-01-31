import React, { useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const NewUserModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      if (fileList.length > 0) {
        formData.append("profilePicture", fileList[0].originFileObj);
      }

      await axios.post("http://localhost:3000/api/users/createUser", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onAdd();
      form.resetFields();
      setFileList([]);
      onCancel();
      message.success("User added successfully.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  return (
    <Modal
      title="Add New User"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Add User
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleAdd}>
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "Please input first name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Please input last name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please input email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select role!" }]}
        >
          <Select>
            <Select.Option value="staff">Staff</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="superAdmin">Super Admin</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="mobile"
          label="Mobile"
          rules={[{ required: true, message: "Please input mobile!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="profilePicture"
          label="Profile Picture"
        >
          <Upload
            listType="picture"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewUserModal;
