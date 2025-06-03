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
import { Total_Partner } from "../../lib/api/home.js";

const kpiData = {
  totalProducts: {text: "Total number of items in stock" },
  lowStockProducts: {text: "Products not exported in the past 3 months" },
  transactionsToday: {text: "Number of transactions today" },
  totalPartners: {text: "Number of partners available" },
};

export default function DashboardHomePage() {
  const [count, setCount] = useState(0);
  const [transaction, setTransaction] = useState(0);
  const [DeadStock, setDeadStock] = useState(0);
  const [Partner, setPartner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState();
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setErr(null);
      try {
        const [data_product, data_transaction, data_stock , data_partner ] = await Promise.all([
          Total_Product(),
          Transaction_Today(),
          Dead_Stock(),
          Total_Partner(),
        ]);
        setCount(data_product.metadata);
        setTransaction(data_transaction.metadata);
        setDeadStock(data_stock.metadata);
        setPartner(data_partner.metadata);
        setLoading(false);
      } catch (error) {
        console.error("ERR on Promise.all:", error);
        setErr(error.message || "An error occurred while loading data.");
        setCount(null);
        setTransaction(null);
        setDeadStock(null);
        setLoading(false);
      } 
    };

    loadAllData();
  }, []);

  if (loading) {
    return <Loading/>
  }
  if (err) {
    return <div>Error </div>;
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
          changeText={kpiData.totalProducts.text}
        />
        <KpiCard
          title="Unsold Items"
          value={DeadStock}
          icon={FaExclamationTriangle}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-700"
          changeText={kpiData.lowStockProducts.text}
        />
        <KpiCard
          title="Transaction Today"
          value={transaction}
          icon={FaExchangeAlt}
          iconBgColor="bg-green-100"
          iconColor="text-green-700"
          changeText={kpiData.transactionsToday.text}
        />
        <KpiCard
          title="Partner "
          value={Partner}
          icon={FaUsers}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-700"
          changeText={kpiData.totalPartners.text}
        />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <ImportExportChart />
      </div>
    </div>
  );
}
