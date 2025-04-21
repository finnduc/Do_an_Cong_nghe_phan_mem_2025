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

export default function DashboardHomePage() {
  return (
    <div className="bg-gray-100 mb-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Tổng Quan Kho Hàng
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Product Total"
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
          title="Transaction Today"
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
  