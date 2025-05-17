// StockTable.js
import ReuseTable from "../ReuseTable";
import SearchBar from "../SearchBar";
import { addEditButtons } from "../AddEditDeleteButtons";
import { jsonToTableFormat } from "@/lib/utils";

export default function StockTable({
  currentData,
  totalPages,
  totalRecords,
  currentPage,
  getNextPage,
  searchText,
  setSearchText,
  onEdit,
  onDelete,
}) {
  const modifiedData = addEditButtons(currentData, onEdit, onDelete);
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
