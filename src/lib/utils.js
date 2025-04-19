import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function jsonToTableFormat(jsonData, offset = 0) {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return { columns: [], rows: [] };
  }

  let columns = Object.keys(jsonData[0]);
  let skipIdColumn = false;

  // Nếu cột đầu tiên chứa "id"
  if (columns[0].toLowerCase().includes("id")) {
    columns = ["No", ...columns.slice(1)];
    skipIdColumn = true;
  }

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
          ...columns.slice(1).map((col) => {
            const value = row[col];
            return isDate(value) ? formatDate(value) : (value ? value : "N/A");
          }),
        ]
      : columns.map((col) => {
          const value = row[col];
          return isDate(value) ? formatDate(value) : value;
        });

    return values;
  });

  return { columns, rows };
}
export function formatDate(value) {
  const date = new Date(value);
  // Format thành YYYY-MM-DD
  const formatted = date.toISOString().split("T")[0];
  return formatted;
}
