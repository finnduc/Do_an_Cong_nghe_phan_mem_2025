"use client";
import Loading from "./loading.jsx";
import React, { useState, useEffect, useRef } from "react";
import KpiCard from "../../components/home/KpiCard.jsx";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaUsers,
} from "react-icons/fa";
import ImportExportChart from "../../components/home/ImportExportChart.jsx";
import {
  Total_Product,
  Transaction_Today,
  Dead_Stock,
  Total_Partner,
} from "../../lib/api/home.js";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Imports for PDF export functionality
import { fetchStock } from "@/lib/api/stock";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const kpiData = {
  totalProducts: { text: "Total number of items in stock" },
  lowStockProducts: { text: "Products not exported in the past 3 months" },
  transactionsToday: { text: "Number of transactions today" },
  totalPartners: { text: "Number of partners available" },
};
export default function DashboardHomePage() {
  const [count, setCount] = useState(0);
  const [transaction, setTransaction] = useState(0);
  const [DeadStock, setDeadStock] = useState(0);
  const [Partner, setPartner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState();
  const [isConfirmingExport, setIsConfirmingExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [stockToExport, setStockToExport] = useState([]);
  const pdfRef = useRef();
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setErr(null);
      try {
        const [data_product, data_transaction, data_stock, data_partner] =
          await Promise.all([
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
        setErr(error.message || "An error occurred while loading data.");
        setCount(null);
        setTransaction(null);
        setDeadStock(null);
        setLoading(false);
      }
    };
    loadAllData();
  }, []);
  useEffect(() => {
    const generatePdf = async () => {
      if (isExporting && stockToExport.length > 0 && pdfRef.current) {
        try {
          const input = pdfRef.current;
          const canvas = await html2canvas(input, { scale: 2 });
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
          pdf.save("stock_report.pdf");
          toast.success("Xuất báo cáo kho thành công!");
        } catch (err) {
          toast.error("Error creating PDF. Please try again.");
        } finally {
          setIsConfirmingExport(false);
          setIsExporting(false);
          setStockToExport([]);
        }
      }
    };

    generatePdf();
  }, [stockToExport, isExporting]);

  const handleExportClick = async () => {
    setIsExporting(true);
    toast.info("Preparing warehouse data for export...");
    try {
      const stockData = await fetchStock(1, 10000, {});
      if (stockData?.metadata?.data?.length > 0) {
        setStockToExport(stockData.metadata.data);
      } else {
        toast.warning("There is no data in the warehouse to export.");
        setIsExporting(false);
      }
    } catch (error) {
      toast.error("Error retrieving warehouse data. Please try again.");
      setIsExporting(false);
    }
  };

  if (loading) return <Loading />;
  if (err) return <div>Error</div>;

  return (
    <div className="bg-gray-100 mb-6">
      <Toaster richColors position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Warehouse Overview
        </h1>
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white"
          onClick={() => setIsConfirmingExport(true)}
        >
          Export Stock PDF
        </Button>
      </div>
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

      {/* Confirmation Dialog */}
      {isConfirmingExport && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg border shadow-md p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-center">
              Confirm File Export
            </h3>
            <p className="text-center my-4">
              Are you sure you want to export all products in your inventory to
              PDF?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsConfirmingExport(false)}
                disabled={isExporting}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white"
                onClick={handleExportClick}
                disabled={isExporting}
              >
                {isExporting ? "Đang xuất..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {stockToExport.length > 0 && (
        <div className="absolute -z-50 -left-[9999px]">
          <div ref={pdfRef} className="p-4 bg-white" style={{ width: "100%" }}>
            <h2 className="text-center text-2xl font-bold mb-4">
              Inventory report
            </h2>
            <p className="text-center text-sm mb-4">
              Creation date: {new Date().toLocaleDateString()}
            </p>
            <table className="w-full text-xs border-collapse border border-slate-400">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 p-2 text-left">
                    Product Name
                  </th>
                  <th className="border border-slate-300 p-2 text-left">
                    Category Name
                  </th>
                  <th className="border border-slate-300 p-2 text-left">
                    Manufacturer Name
                  </th>
                  <th className="border border-slate-300 p-2 text-right">
                    Quantity
                  </th>
                  <th className="border border-slate-300 p-2 text-right">
                    Import Price
                  </th>
                  <th className="border border-slate-300 p-2 text-right">
                    Export Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {stockToExport.map((item) => (
                  <tr key={item.stock_id}>
                    <td className="border border-slate-300 p-2">
                      {item.product_name}
                    </td>
                    <td className="border border-slate-300 p-2">
                      {item.category_name}
                    </td>
                    <td className="border border-slate-300 p-2">
                      {item.manufacturer}
                    </td>
                    <td className="border border-slate-300 p-2 text-right">
                      {item.quantity}
                    </td>
                    <td className="border border-slate-300 p-2 text-right">
                      ${Number(item.product_price_import).toFixed(2)}
                    </td>
                    <td className="border border-slate-300 p-2 text-right">
                      ${Number(item.product_price_export).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
