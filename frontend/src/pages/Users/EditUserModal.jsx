import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const EditUserModal = ({ visible, onCancel, onEdit, selectedUserId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const fetchUser = async () => {
    try {
      const user = await axios.get(
        `http://localhost:3000/api/users/getUserById/${selectedUserId}`
      );

      const {
        firstName,
        lastName,
        username,
        email,
        role,
        isActive,
        profilePicture,
      } = user.data;

      form.setFieldsValue({
        firstName,
        lastName,
        username,
        email,
        role,
        isActive: isActive.toString(),
      });

      // If there's an existing profile picture, set it to the fileList
      if (profilePicture) {
        setFileList([
          {
            uid: "-1", // An arbitrary unique ID for the uploaded file
            name: profilePicture.split("/").pop(), // Get the filename
            status: "done", // Mark it as done
            url: "http://localhost:3000" + profilePicture, // URL of the existing profile picture
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedUserId && visible) {
      fetchUser();
    }
  }, [selectedUserId, visible]);

  const handleEdit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profilePicture", fileList[0].originFileObj);
      }

      await axios.put(
        `http://localhost:3000/api/users/updateUser/${selectedUserId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onEdit();
      form.resetFields();
      setFileList([]);
      onCancel();
      message.success("User updated successfully.");
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
      title="Edit User"
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
          Edit User
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleEdit}>
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
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select>
            <Select.Option value="staff">Staff</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="superAdmin">Super Admin</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="isActive"
          label="Status"
          rules={[{ required: true, message: "Please select a status!" }]}
        >
          <Select>
            <Select.Option value="true">Active</Select.Option>
            <Select.Option value="false">Inactive</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="profilePicture" label="Profile Picture">
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

export default EditUserModal;
