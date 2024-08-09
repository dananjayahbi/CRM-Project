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
import { Menu, ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";

const theme = {
  token: {
    // Seed Token
    colorBgElevated: "#303548", // Sub-menus background color
    colorBgSpotlight: "#303548", // Sidebar Tooltips background color
  },
};

// Define the menu items with navigation paths
const items = [
  {
    key: "1",
    icon: <AppstoreOutlined />,
    label: "Dashboard",
    path: "/",
  },
  {
    key: "2",
    icon: <ShopOutlined />,
    label: "Sales",
    children: [
      { key: "21", label: "Sales List", icon: <UnorderedListOutlined />, path: "/sales/list" },
      { key: "22", label: "Sales Return List", icon: <UnorderedListOutlined />, path: "/sales/return-list" },
    ],
  },
  {
    key: "3",
    icon: <TeamOutlined />,
    label: "Customers",
    path: "/customers",
  },
  {
    key: "4",
    icon: <ReconciliationOutlined />,
    label: "Purchase",
    children: [
      { key: "41", label: "Purchase List", icon: <UnorderedListOutlined />, path: "/purchase/list" },
      { key: "42", label: "Purchase Return List", icon: <UnorderedListOutlined />, path: "/purchase/return-list" },
    ],
  },
  {
    key: "5",
    icon: <UserSwitchOutlined />,
    label: "Suppliers",
    path: "/suppliers",
  },
  {
    key: "6",
    icon: <ProductOutlined />,
    label: "Products",
    children: [
      { key: "61", label: "Products List", icon: <UnorderedListOutlined />, path: "/products/list" },
      { key: "62", label: "Product Categories", icon: <UnorderedListOutlined />, path: "/products/categories" },
      { key: "63", label: "Brands", icon: <OneToOneOutlined />, path: "/products/brands" },
      { key: "64", label: "Print Labels", icon: <BarcodeOutlined />, path: "/products/print-labels" },
    ],
  },
  {
    key: "7",
    icon: <CreditCardOutlined />,
    label: "Expenses",
    children: [
      { key: "71", label: "Expenses List", icon: <UnorderedListOutlined />, path: "/expenses/list" },
      { key: "72", label: "Expense Categories", icon: <UnorderedListOutlined />, path: "/expenses/categories" },
    ],
  },
  {
    key: "8",
    icon: <AreaChartOutlined />,
    label: "Reports",
    children: [
      { key: "81", label: "Profit & Loss Report", icon: <FileOutlined />, path: "/reports/profit-loss" },
      { key: "82", label: "Purchase Report", icon: <FileOutlined />, path: "/reports/purchase" },
      { key: "83", label: "Purchase Return Report", icon: <FileOutlined />, path: "/reports/purchase-return" },
      { key: "84", label: "Sales Report", icon: <FileOutlined />, path: "/reports/sales" },
      { key: "85", label: "Sales Return Report", icon: <FileOutlined />, path: "/reports/sales-return" },
      { key: "86", label: "Stock Report", icon: <FileOutlined />, path: "/reports/stock" },
      { key: "87", label: "Expense Report", icon: <FileOutlined />, path: "/reports/expense" },
      { key: "88", label: "Customer Report", icon: <FileOutlined />, path: "/reports/customer" },
      { key: "89", label: "Supplier Report", icon: <FileOutlined />, path: "/reports/supplier" },
    ],
  },
  {
    key: "9",
    icon: <UserOutlined />,
    label: "Users",
    path: "/users",
  },
  {
    key: "10",
    icon: <SettingOutlined />,
    label: "Settings",
    children: [
      { key: "101", label: "Company Profile", icon: <FundProjectionScreenOutlined />, path: "/settings/company-profile" },
      { key: "102", label: "Site Settings", icon: <BranchesOutlined />, path: "/settings/site-settings" },
      { key: "103", label: "Tax", icon: <PercentageOutlined />, path: "/settings/tax" },
      { key: "104", label: "Units", icon: <MoneyCollectOutlined />, path: "/settings/units" },
      { key: "105", label: "Payment Types", icon: <CreditCardOutlined />, path: "/settings/payment-types" },
      { key: "106", label: "Database Backup", icon: <DatabaseOutlined />, path: "/settings/database-backup" },
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
  const navigate = useNavigate();

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

    // Navigate to the path associated with the selected key
    const selectedItem = items.flatMap((item) =>
      item.children ? [item, ...item.children] : [item]
    ).find((item) => item.key === key);
    if (selectedItem && selectedItem.path) {
      navigate(selectedItem.path);
    }
  };

  return (
    <ConfigProvider theme={theme}>
      <div
        style={{
          height: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#303548",
          margin: "0 1px 0 0"
        }}
      >
        <div
          style={{
            backgroundColor: "#334454",
            width: "130px",
            height: "50px",
            borderRadius: "7px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{color: "#fff"}}>The LOGO</h1>
        </div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]} // Set the selected key
        openKeys={stateOpenKeys} // Set the open keys
        onOpenChange={onOpenChange}
        onSelect={handleSelect} // Handle menu item selection
        items={items}
        style={{ height: "100vh", textAlign: "left" }}
      />
    </ConfigProvider>
  );
};

export default SideMenu;
