import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, Upload, message, Select } from "antd";

const EditUserModal = ({ visible, onCancel, onEdit, selectedUserId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const user = await axios.get(
        `http://localhost:3000/api/users/getUserById/${selectedUserId}`
      );
      form.setFieldsValue({
        firstName: user.data.firstName,
        lastName: user.data.lastName,
        username: user.data.username,
        email: user.data.email,
        role: user.data.role,
        isActive: user.data.isActive.toString(),
      });

      console.log(user.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [selectedUserId]);

  const handleEdit = async (values) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/users/updateUser/${selectedUserId}`,
        values
      );
      onEdit();
      form.resetFields();
      onCancel();
      message.success("User updated successfully.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      </Form>
    </Modal>
  );
};

export default EditUserModal;
