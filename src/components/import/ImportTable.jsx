import TransactionTable from "../TransactionTable";
import SearchBar from "../SearchBar";
import { useAuth } from "@/lib/auth/authContext";

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const formatted = date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatted;
}

export default function ImportTable({
  currentData,
  totalPages,
  totalRecords,
  currentPage,
  getNextPage,
  searchText,
  setSearchText,
}) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading import data...</div>;
  }

  const handleSearchText = (e) => setSearchText(e.target.value);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <SearchBar value={searchText} placeholderText="Transaction ID" onValueChange={handleSearchText} />
      </div>

      <TransactionTable
        columns={["Transaction ID", "Employee", "Partner", "Note", "Total amount", "Created at"]}
        rows={currentData.map((transaction) => ({
          data: [
            transaction.header_id,
            transaction.employee_name || transaction.employee_id,
            transaction.partner_name || transaction.partner_id,
            transaction.notes || "-",
            transaction.total_amount,
            formatDate(transaction.created_at),
          ],
          items: transaction.items?.map((detail) => [
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
        onPageChange={getNextPage}
        maxLength={25}
      />
    </div>
  );
}