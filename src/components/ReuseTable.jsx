"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";


// Hàm TruncatedCell
const TruncatedCell = ({ text, maxLength = 25 }) => {
  const isTruncated = text.length > maxLength;
  const displayText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

  return (
    <div className="relative p-2 min-h-[50px] flex items-center group">
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {displayText}
      </span>
      {isTruncated && (
        <div className="absolute left-0 top-full mt-1 bg-black text-white text-sm rounded p-2 shadow-lg w-max max-w-[200px] z-50 hidden group-hover:block">
          {text}
        </div>
      )}
    </div>
  );
};

// Component ReuseTable
const ReuseTable = ({
  columns = [],
  rows = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  const [page, setPage] = useState(currentPage);

  const handleChange = (e) => {
    const input = e.target.value;
    // Cho phép chuỗi rỗng hoặc chuỗi toàn số
    if (input === '' || /^[0-9]+$/.test(input)) {
      const newPage = input === '' ? 1 : parseInt(input, 10);
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
        onPageChange(newPage);
      }
    }
  };

  return (
    <div>
      <div className="relative overflow-y-auto border border-gray-300 shadow-md sm:rounded-lg max-h-[70vh]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`header-${index}`}
                  scope="col"
                  className='py-3 px-4 border-b text-left'
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} className="hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className="px-4 border-b  text-left"
                    >
                      {/* Sử dụng TruncatedCell để hiển thị nội dung ô */}
                      <TruncatedCell text={String(cell)} maxLength={25} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-4 px-4 text-center text-gray-500"
                >
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="w-full flex justify-between items-center text-sm px-4 py-2 font-medium">
        <span className="text-gray-500">
          Showing page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            className="bg-white border border-gray-200 rounded-md p-1 hover:bg-slate-100 disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() => {
              const newPage = currentPage - 1;
              setPage(newPage);
              onPageChange(newPage);
            }}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            className="w-10 text-center"
            value={page}
            onChange={handleChange}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <button
            className="bg-white border border-gray-200 rounded-md p-1 hover:bg-slate-100 disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
            onClick={() => {
              const newPage = currentPage + 1;
              setPage(newPage);
              onPageChange(newPage);
            }}
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReuseTable;
