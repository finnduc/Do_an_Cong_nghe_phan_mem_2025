"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

// TruncatedCell Component
const TruncatedCell = ({ text, maxLength = 15 }) => {
  const isTruncated = text.length > maxLength;
  const displayText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

  return (
    <div className="relative min-h-[50px] flex items-center group">
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

// ReuseTable Component
const ReuseTable = ({
  columns = [],
  rows = [],
  currentPage = 1,
  totalPages = 1,
  maxLength = 15,
  onPageChange = () => {},
  totalRecords = 0,
  scrollMode = false,
  maxHeight = "480px",
}) => {
  const [inputValue, setInputValue] = useState(currentPage);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleCommit = () => {
    const newPage = parseInt(inputValue, 10);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      setInputValue(newPage);
      onPageChange(newPage);
    } else {
      setInputValue(currentPage);
    }
  };

  return (
    <div>
      <div
        className={`border border-gray-300 shadow-md rounded-lg bg-white ${
          scrollMode ? "overflow-y-auto" : "h-full"
        }`}
        style={scrollMode ? { maxHeight: maxHeight } : {}}
      >
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`header-${index}`}
                  scope="col"
                  className={`py-3 px-4 border-b text-left sticky top-0 bg-gray-100 z-10 ${
                    index === 0 ? "rounded-tl-lg" : ""
                  } ${index === columns.length - 1 ? "rounded-tr-lg" : ""}`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  className={`hover:bg-gray-50 ${
                    !scrollMode && rowIndex === rows.length - 1
                      ? "rounded-b-lg"
                      : ""
                  }`}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className={`px-4 border-b text-left ${
                        !scrollMode && rowIndex === rows.length - 1
                          ? cellIndex === 0
                            ? "rounded-bl-lg"
                            : cellIndex === row.length - 1
                            ? "rounded-br-lg"
                            : ""
                          : ""
                      }`}
                    >
                      {typeof cell === "string" ? (
                        <TruncatedCell text={cell} maxLength={maxLength} />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 px-4 text-center text-gray-500 text-lg font-medium rounded-lg"
                >
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!scrollMode && (
        <div className="w-full flex justify-between items-center text-sm px-4 py-2 font-medium">
          <span className="text-gray-500">
            Showing {currentPage} of {totalPages} pages - Total records:{" "}
            {totalRecords}
          </span>
          <div className="flex gap-2">
            <button
              className="bg-white border border-gray-200 rounded-md p-1 hover:bg-slate-100 disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => {
                const newPage = currentPage - 1;
                setInputValue(newPage);
                onPageChange(newPage);
              }}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <input
              value={inputValue}
              onChange={handleChange}
              onBlur={handleCommit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCommit();
                }
              }}
              className="w-12 text-center"
            />
            <button
              className="bg-white border border-gray-200 rounded-md p-1 hover:bg-slate-100 disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => {
                const newPage = currentPage + 1;
                setInputValue(newPage);
                onPageChange(newPage);
              }}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReuseTable;