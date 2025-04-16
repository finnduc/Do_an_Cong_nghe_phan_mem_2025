import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function jsonToTableFormat(jsonData) {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return { columns: [], rows: [] };
  }

  const columns = Object.keys(jsonData[0]);
  const rows = jsonData.map(row => columns.map(col => row[col]));

  return { columns, rows };
}