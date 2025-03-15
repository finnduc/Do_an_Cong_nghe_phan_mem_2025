import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRef, useEffect } from "react";

export default function FixedHeaderTable({ columns, rows }) {
  const gridTemplateColumns = `repeat(${columns.length}, minmax(0, 1fr))`;

  return (
    <div className="w-full border-[1px] border-input rounded-md">
      <div
        className="grid border-b bg-slate-50"
        style={{ gridTemplateColumns }}
      >
        {columns.map((column, index) => (
          <div key={index} className="p-2 font-medium text-left uppercase">
            {column}
          </div>
        ))}
      </div>
      <ScrollArea className="w-full h-[340px]">
        <div className="divide-y text-gray-700">
          {rows.length !== 0 ? (
            rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid"
                style={{ gridTemplateColumns }}
              >
                {row.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className="p-2 text-left border-r last:border-r-0"
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-slate-500 border-r last:border-r-0">
              No Data
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
