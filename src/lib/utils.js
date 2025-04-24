import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function jsonToTableFormat(jsonData, page = 1, limit = 8) {
  const offset = (page - 1) * limit;
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return { columns: [], rows: [] };
  }

  let rawColumns = Object.keys(jsonData[0]);
  let skipIdColumn = false;

  // Hàm format tên cột: snake_case => Snake Case hoặc giữ nguyên tùy ý
  const formatColumnName = (col) => col.replace(/_/g, " "); // chuyển _ thành khoảng trắng

  // Nếu cột đầu tiên chứa "id"
  if (rawColumns[0].toLowerCase().includes("id")) {
    skipIdColumn = true;
  }

  const columns = skipIdColumn
    ? ["No", ...rawColumns.slice(1).map(formatColumnName)]
    : rawColumns.map(formatColumnName);

  const isDate = (val) => {
    const date = new Date(val);
    return (
      !isNaN(date.getTime()) && typeof val === "string" && val.match(/T|Z|[-:]/)
    );
  };

  const formatDate = (val) => {
    const d = new Date(val);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const rows = jsonData.map((row, index) => {
    const values = skipIdColumn
      ? [
          index + offset + 1,
          ...rawColumns.slice(1).map((col) => {
            const value = row[col];
            return isDate(value) ? formatDate(value) : value ?? "N/A";
          }),
        ]
      : rawColumns.map((col) => {
          const value = row[col];
          return isDate(value) ? formatDate(value) : value ?? "N/A";
        });

    return values;
  });

  return { columns, rows };
}

export function filterIdColumns(data) {
  if (!data || !data.columns || !data.rows) {
    return data;
  }
  const { columns, rows } = data;

  // Tìm index các cột KHÔNG chứa 'id' (không phân biệt hoa thường)
  const filteredIndices = columns
    .map((col, idx) => ({ col, idx }))
    .filter(({ col }) => !col.toLowerCase().includes("id"))
    .map(({ idx }) => idx);

  // Lọc lại columns và rows theo các chỉ số giữ lại
  const filteredColumns = filteredIndices.map(idx => columns[idx]);
  const filteredRows = rows.map(row => filteredIndices.map(idx => row[idx]));

  return {
    columns: filteredColumns,
    rows: filteredRows,
  };
}

export function formatDate(value) {
  const date = new Date(value);
  // Format thành YYYY-MM-DD
  const formatted = date.toISOString().split("T")[0];
  return formatted;
}
