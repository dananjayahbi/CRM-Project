import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  SettingOutlined,
  ShopOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  ProductOutlined,
  ReconciliationOutlined,
  UserSwitchOutlined,
  CreditCardOutlined,
  FileOutlined,
  UserOutlined,
  OneToOneOutlined,
  BarcodeOutlined,
  AreaChartOutlined,
  FundProjectionScreenOutlined,
  BranchesOutlined,
  MoneyCollectOutlined,
  PercentageOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

// Define the menu items
const items = [
  {
    key: "1",
    icon: <AppstoreOutlined />,
    label: "Dashboard",
  },
  {
    key: "2",
    icon: <ShopOutlined />,
    label: "Sales",
    children: [
      { key: "21", label: "Sales List", icon: <UnorderedListOutlined /> },
      {
        key: "22",
        label: "Sales Return List",
        icon: <UnorderedListOutlined />,
      },
    ],
  },
  {
    key: "3",
    icon: <TeamOutlined />,
    label: "Customers",
  },
  {
    key: "4",
    icon: <ReconciliationOutlined />,
    label: "Purchase",
    children: [
      { key: "41", label: "Purchase List", icon: <UnorderedListOutlined /> },
      {
        key: "42",
        label: "Purchase Return List",
        icon: <UnorderedListOutlined />,
      },
    ],
  },
  {
    key: "5",
    icon: <UserSwitchOutlined />,
    label: "Suppliers",
  },
  {
    key: "6",
    icon: <ProductOutlined />,
    label: "Products",
    children: [
      { key: "61", label: "Products List", icon: <UnorderedListOutlined /> },
      {
        key: "62",
        label: "Product Categories",
        icon: <UnorderedListOutlined />,
      },
      { key: "63", label: "Brands", icon: <OneToOneOutlined /> },
      { key: "64", label: "Print Labels", icon: <BarcodeOutlined /> },
    ],
  },
  {
    key: "7",
    icon: <CreditCardOutlined />,
    label: "Expenses",
    children: [
      { key: "71", label: "Expenses List", icon: <UnorderedListOutlined /> },
      {
        key: "72",
        label: "Expense Categories",
        icon: <UnorderedListOutlined />,
      },
    ],
  },
  {
    key: "8",
    icon: <AreaChartOutlined />,
    label: "Reports",
    children: [
      { key: "81", label: "Profit & Loss Report", icon: <FileOutlined /> },
      { key: "82", label: "Purchase Report", icon: <FileOutlined /> },
      { key: "83", label: "Purchase Return Report", icon: <FileOutlined /> },
      { key: "84", label: "Sales Report", icon: <FileOutlined /> },
      { key: "85", label: "Sales Return Report", icon: <FileOutlined /> },
      { key: "86", label: "Stock Report", icon: <FileOutlined /> },
      { key: "87", label: "Expense Report", icon: <FileOutlined /> },
      { key: "88", label: "Customer Report", icon: <FileOutlined /> },
      { key: "89", label: "Supplier Report", icon: <FileOutlined /> },
    ],
  },
  {
    key: "9",
    icon: <UserOutlined />,
    label: "Users",
  },
  {
    key: "10",
    icon: <SettingOutlined />,
    label: "Settings",
    children: [
      {
        key: "101",
        label: "Company Profile",
        icon: <FundProjectionScreenOutlined />,
      },
      { key: "102", label: "Site Settings", icon: <BranchesOutlined /> },
      { key: "103", label: "Tax List", icon: <PercentageOutlined /> },
      { key: "104", label: "Units List", icon: <MoneyCollectOutlined /> },
      { key: "105", label: "Payment Types List", icon: <CreditCardOutlined /> },
      { key: "106", label: "Database Backup", icon: <DatabaseOutlined /> },
    ],
  },
];

// Function to get level keys
const getLevelKeys = (items1) => {
  const key = {};
  const func = (items2, level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const levelKeys = getLevelKeys(items);

const SideMenu = () => {
  // Retrieve selected key and open keys from session storage or use defaults
  const savedSelectedKey = sessionStorage.getItem("selectedKey") || "1";
  const savedOpenKeys = JSON.parse(sessionStorage.getItem("openKeys")) || [];

  const [stateOpenKeys, setStateOpenKeys] = useState(savedOpenKeys);
  const [selectedKey, setSelectedKey] = useState(savedSelectedKey);

  useEffect(() => {
    // Update session storage when selected key or open keys change
    sessionStorage.setItem("selectedKey", selectedKey);
    sessionStorage.setItem("openKeys", JSON.stringify(stateOpenKeys));
  }, [selectedKey, stateOpenKeys]);

  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  const handleSelect = ({ key }) => {
    setSelectedKey(key);
    const findOpenKeys = (items, key) => {
      for (const item of items) {
        if (item.key === key) return [key];
        if (item.children) {
          const result = findOpenKeys(item.children, key);
          if (result.length > 0) {
            return [item.key, ...result];
          }
        }
      }
      return [];
    };
    const newOpenKeys = findOpenKeys(items, key);
    setStateOpenKeys(newOpenKeys);
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]} // Set the selected key
      openKeys={stateOpenKeys} // Set the open keys
      onOpenChange={onOpenChange}
      onSelect={handleSelect} // Handle menu item selection
      items={items}
      style={{ height: "100vh", textAlign: "left" }}
    />
  );
};

export default SideMenu;
