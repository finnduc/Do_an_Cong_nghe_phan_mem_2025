"use client";
import React from "react";
import KpiCard from "../../components/home/KpiCard.jsx";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaUsers,
} from "react-icons/fa";
import ImportExportChart from "../../components/home/ImportExportChart.jsx";

const kpiData = {
  totalProducts: { value: "150", change: +2.5, text: "so với hôm qua" },
  lowStockProducts: { value: "12", change: -5, text: "so với tuần trước" },
  transactionsToday: { value: "25", change: +10, text: "so với hôm qua" },
  totalPartners: { value: "5", change: +1.1, text: "so với tháng trước" },
};
const dummyRecentTransactions = [
  {
    id: "tx1",
    type: "Nhập",
    productName: "Laptop Model X",
    quantity: 10,
    time: "2025-04-12T10:30:00Z",
  },
  {
    id: "tx2",
    type: "Xuất",
    productName: "Bàn phím cơ Z",
    quantity: 5,
    time: "2025-04-12T09:15:00Z",
  },
  {
    id: "tx3",
    type: "Nhập",
    productName: "Chuột không dây Y",
    quantity: 20,
    time: "2025-04-11T16:00:00Z",
  },
  {
    id: "tx4",
    type: "Xuất",
    productName: "Màn hình 24 inch",
    quantity: 2,
    time: "2025-04-11T11:45:00Z",
  },
  {
    id: "tx5",
    type: "Nhập",
    productName: "Laptop Model X",
    quantity: 5,
    time: "2025-04-10T14:20:00Z",
  },
  {
    id: "tx6",
    type: "Nhập",
    productName: "Ổ cứng SSD 1TB",
    quantity: 15,
    time: "2025-04-10T10:00:00Z",
  },
  {
    id: "tx7",
    type: "Xuất",
    productName: "Chuột không dây Y",
    quantity: 8,
    time: "2025-04-09T17:30:00Z",
  },
];
const formatTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const diffDays = Math.floor(diffSeconds / (60 * 60 * 24));

    if (diffDays === 0 && now.getDate() === date.getDate()) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (
      diffDays === 0 ||
      (diffDays === 1 && now.getDate() !== date.getDate())
    ) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid Date";
  }
};

export default function DashboardHomePage() {
  return (
    <div className="bg-gray-100 mb-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Tổng Quan Kho Hàng
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Tổng Sản Phẩm"
          value={kpiData.totalProducts.value}
          icon={FaBoxes}
          iconBgColor="bg-blue-100" 
          iconColor="text-blue-700" 
          changePercent={Math.abs(kpiData.totalProducts.change)}
          changeText={kpiData.totalProducts.text}
          isPositiveChange={kpiData.totalProducts.change >= 0}
        />
        <KpiCard
          title="Sắp Hết Hàng"
          value={kpiData.lowStockProducts.value}
          icon={FaExclamationTriangle}
          iconBgColor="bg-yellow-100" 
          iconColor="text-yellow-700" 
          changePercent={Math.abs(kpiData.lowStockProducts.change)}
          changeText={kpiData.lowStockProducts.text}
          isPositiveChange={kpiData.lowStockProducts.change >= 0}
        />
        <KpiCard
          title="Giao dịch Hôm Nay"
          value={kpiData.transactionsToday.value}
          icon={FaExchangeAlt}
          iconBgColor="bg-green-100" // Nền nhạt
          iconColor="text-green-700" // Icon đậm
          changePercent={Math.abs(kpiData.transactionsToday.change)}
          changeText={kpiData.transactionsToday.text}
          isPositiveChange={kpiData.transactionsToday.change >= 0}
        />
        <KpiCard
          title="Sản phẩm tồn kho "
          value={kpiData.totalPartners.value}
          icon={FaUsers}
          iconBgColor="bg-purple-100" 
          iconColor="text-purple-700" 
          changePercent={Math.abs(kpiData.totalPartners.change)}
          changeText={kpiData.totalPartners.text}
          isPositiveChange={kpiData.totalPartners.change >= 0}
        />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <ImportExportChart />
      </div>
    </div>
  );
}
  