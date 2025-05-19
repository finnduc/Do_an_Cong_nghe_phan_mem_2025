import ReuseTable from "../ReuseTable";
import SearchBar from "../SearchBar";
import { addEditButtons } from "../AddEditDeleteButtons";
import { jsonToTableFormat } from "@/lib/utils";
import { useAuth } from "@/lib/auth/authContext";

export default function StockTable({
  currentData,
  totalPages,
  totalRecords,
  currentPage,
  getNextPage,
  searchText,
  setSearchText,
  onEdit,
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading stock data...</div>; // hoặc một spinner
  }

  let modifiedData = currentData;
  if (user && user.role !== "employee") {
    modifiedData = addEditButtons(currentData, onEdit, null, true);
  }

  const formattedData = jsonToTableFormat(modifiedData, currentPage);
  const handleSearchText = (e) => setSearchText(e.target.value);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <SearchBar value={searchText} onValueChange={handleSearchText} />
      </div>
      <ReuseTable
        columns={formattedData.columns}
        rows={formattedData.rows}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={getNextPage}
        maxLength={25}
      />
    </div>
  );
}
