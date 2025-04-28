"use client";
import Loading from "./loading.jsx";
import React, { useState, useEffect } from "react";
import KpiCard from "../../components/home/KpiCard.jsx";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaUsers,
} from "react-icons/fa";
import ImportExportChart from "../../components/home/ImportExportChart.jsx";
import { Total_Product } from "../../lib/api/home.js";
import { Transaction_Today } from "../../lib/api/home.js";
import { Dead_Stock } from "../../lib/api/home.js";
import { Chart } from "../../lib/api/home.js";


const kpiData = {
  totalProducts: {change: +2.5, text: "so với hôm qua" },
  lowStockProducts: {value: "5",  change: -5, text: "so với tuần trước" },
  transactionsToday: { change: +10, text: "so với hôm qua" },
  totalPartners: {  change: +1.1, text: "so với tháng trước" },
};

export default function DashboardHomePage() {
  const [count, setCount] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [DeadStock, setDeadStock] = useState(null);
  const [num , setNum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState();
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setErr(null);
      try {
        const [data_product, data_transaction, data_stock ] = await Promise.all([
          Total_Product(),
          Transaction_Today(),
          Dead_Stock(),
          //Chart(),
        ]);
        setCount(data_product.metadata);
        setTransaction(data_transaction.metadata);
        setDeadStock(data_stock.metadata);
      } catch (error) {
        console.error("Lỗi trong Promise.all:", error);
        setErr(error.message || "Có lỗi xảy ra khi tải dữ liệu");
        setCount(null);
        setTransaction(null);
        setDeadStock(null);
      } finally {
        console.log("Promise.all: vào finally, gọi setLoading(false)");
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (loading) {
    return <Loading/>
  }
  if (err) {
    return <div>Lỗi </div>;
  }
  return (
    <div className="bg-gray-100 mb-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Warehouse Overview
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Product Total"
          value={count}
          icon={FaBoxes}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-700"
          changePercent={Math.abs(kpiData.totalProducts.change)}
          changeText={kpiData.totalProducts.text}
          isPositiveChange={kpiData.totalProducts.change >= 0}
        />
        <KpiCard
          title="Nearly Out of Stock Items"
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
          value={transaction}
          icon={FaExchangeAlt}
          iconBgColor="bg-green-100" // Nền nhạt
          iconColor="text-green-700" // Icon đậm
          changePercent={Math.abs(kpiData.transactionsToday.change)}
          changeText={kpiData.transactionsToday.text}
          isPositiveChange={kpiData.transactionsToday.change >= 0}
        />
        <KpiCard
          title="Slow-moving Inventory "
          value={DeadStock}
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
