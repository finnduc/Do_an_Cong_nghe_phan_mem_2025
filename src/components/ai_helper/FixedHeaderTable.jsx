import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

function paginateData(data, rowsPerPage = 8) {
  if (!Array.isArray(data) || data.length === 0) {
    return { totalPage: 1, paginatedData: [[]] };
  }

  const totalPage = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const paginatedData = [];

  for (let i = 0; i < totalPage; i++) {
    paginatedData.push(data.slice(i * rowsPerPage, (i + 1) * rowsPerPage));
  }

  return { totalPage, paginatedData };
}

const TruncatedCell = ({ text, maxLength = 15 }) => {
  const isTruncated = text.length > maxLength;
  const displayText = isTruncated ? text.slice(0, maxLength) + "..." : text;

  return (
    <div className="relative p-2 min-h-[50px] flex items-center group">
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{displayText}</span>
      {isTruncated && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-black text-white text-sm rounded p-2 shadow-lg w-max z-50 hidden group-hover:block">
          {text}
        </div>
      )}
    </div>
  );
};

export default function FixedHeaderTable({ columns, rows, rowsPerPage = 8 }) {
  // Thêm cột ID vào đầu danh sách
  const updatedColumns = ["ID", ...columns];

  const { totalPage, paginatedData } = useMemo(() => {
    return paginateData(rows, rowsPerPage);
  }, [rows, rowsPerPage]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState(paginatedData[0]);

  useEffect(() => {
    setCurrentData(paginatedData[currentPage - 1]);
  }, [currentPage, paginatedData]);

  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, rows.length);

  // Định nghĩa gridTemplateColumns với độ rộng tự nhiên
  const gridTemplateColumns = `60px repeat(${columns.length}, minmax(0, 1fr))`; // Cột ID rộng 80px, các cột khác chia đều không gian còn lại

  return (
    <div className="w-full">
      {/* Header Table */}
      <div
        className="grid border-[1px] bg-slate-50 border-input rounded-t-xl"
        style={{ gridTemplateColumns }}
      >
        {updatedColumns.map((column, index) => (
          <div key={index} className="p-2 text-left capitalize font-semibold">
            {column}
          </div>
        ))}
      </div>

      {/* Body Table */}
      <div className="w-full">
        <div className="divide-y text-gray-700 bg-white rounded-b-xl border-[1px] border-input border-t-0">
          {currentData.length !== 0 ? (
            currentData.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid"
                style={{ gridTemplateColumns }}
              >
                <div className="p-2 min-h-[50px] flex items-center justify-start font-semibold">
                  {startIndex + rowIndex}
                </div>
                {row.map((cell, cellIndex) => (
                  <TruncatedCell key={cellIndex} text={cell} />
                ))}
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-slate-500 border-r last:border-r-0">
              No Data
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="w-full flex justify-between items-center text-gray-500 text-sm px-4 font-medium">
          <div>
            Showing {startIndex}-{endIndex} of {rows.length} - Total page: {totalPage}
          </div>
          <div className="flex gap-1 pt-2">
            <button
              className="bg-white border-[1px] border-input rounded-md p-1 hover:bg-slate-100 disabled:bg-gray-200"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft />
            </button>
            <button
              className="bg-white border-[1px] border-input rounded-md p-1 hover:bg-slate-100 disabled:bg-gray-200"
              disabled={currentPage === totalPage}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}