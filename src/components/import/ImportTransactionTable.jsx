"use client";
import TransactionTable from "../export/ExportTransactionTable"; // Reuse component

export default function ImportTransactionTable({
  data,
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
}) {
  return (
    <TransactionTable
      columns={["Transaction id", "Employee", "Partner", "Note", "Total amount", "Created at"]}
      rows={data.map((item) => ({
        data: [
          item.header_id,
          item.employee_name || item.employee_id,
          item.partner_name || item.partner_id,
          item.notes || "-",
          item.total_amount,
          item.created_at,
        ],
        items: item.items?.map((detail) => [
          detail.product_name,
          detail.category,
          detail.manufacturer,
          detail.quantity?.toString() ?? "",
          detail.price_per_unit?.toString() ?? "",
          detail.total?.toString() ?? "",
        ]) || [],
      }))}
      itemColumns={["Product name", "Category", "Manufacturer", "Quantity", "Price per unit", "Total"]}
      currentPage={currentPage}
      totalPages={totalPages}
      totalRecords={totalRecords}
      onPageChange={onPageChange}
    />
  );
}
