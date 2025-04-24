"use client";
import { Button } from "../ui/button";
import HistoryCard from "./HistoryCard";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { fetchHistories } from "@/lib/api/history";
import { RotateCcw } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function HistoryUI({ dataList, total }) {
  const [currentDataList, setCurrentDataList] = useState(dataList);
  const [totalRecords, setTotalRecords] = useState(total);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState({
    startTime: null,
    endTime: null,
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterError, setFilterError] = useState("");
  const handleOnExpand = async () => {
    setIsLoading(true);
    try {
      const newData = await fetchHistories(
        currentPage + 1,
        6,
        dateFilter.startTime && dateFilter.endTime ? dateFilter : {}
      );
      setCurrentDataList((prev) => [...prev, ...newData?.metadata?.data]);
      setCurrentPage(currentPage + 1);
      setTotalRecords(newData?.metadata?.total);
    } catch (e) {
      console.log(e);
      toast.error(
        "Error fetching more data. Please try again or contact the administrator."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartDateChange = (value) => {
    const formatted = formatDate(value);
    setDateFilter((prev) => ({ ...prev, startTime: formatted }));
  };

  const handleEndDateChange = (value) => {
    const formatted = formatDate(value);
    setDateFilter((prev) => ({ ...prev, endTime: formatted }));
  };

  const handleOnFilter = async () => {
    if (!dateFilter.startTime && !dateFilter.endTime) {
      setFilterError("Please select start date or end date.");
      return;
    }
    setFilterError("");
    setIsFiltering(true);
    try {
      const newData = await fetchHistories(1, 6, dateFilter);
      setCurrentDataList(newData.metadata.data);
    } catch (e) {
      console.log(e);
      toast.error(
        "Error filtering data. Please try again or contact the administrator."
      );
    } finally {
      setIsFiltering(false);
    }
  };

  const handleResetFilter = () => {
    setDateFilter({
      startDate: null,
      endDate: null,
    });
    setCurrentPage(1);
    setCurrentDataList(dataList);
  };

  return (
    <div className="flex">
      <Toaster />
      <div className="w-[300px] flex flex-col gap-4 pr-4">
        <div className="flex justify-between items-center">
          <div className="text-sm">Start date: </div>
          <button className="hover:text-red-500" onClick={handleResetFilter}>
            <RotateCcw size={15} />
          </button>
        </div>
        <input
          type="date"
          className="p-2 shadow-sm border-[1px] rounded-md"
          value={dateFilter.startTime || ""}
          onChange={(e) => handleStartDateChange(e.target.value)}
        />
        <div className="text-sm">End date: </div>
        <input
          type="date"
          className="p-2 shadow-sm border-[1px] rounded-md"
          value={dateFilter.endTime || ""}
          onChange={(e) => handleEndDateChange(e.target.value)}
        />
        {filterError && (
          <div className="text-red-500 text-sm">{filterError}</div>
        )}
        <Button
          className="mt-4 bg-blue-500 hover:bg-blue-700"
          onClick={handleOnFilter}
          disabled={isFiltering}
        >
          Filter
        </Button>
      </div>
      {currentDataList.length > 0 ? (
        <div className="flex flex-col overflow-auto gap-2 h-[550px] pl-4 w-full py-2">
          {currentDataList.map((item, index) => (
            <HistoryCard key={index} data={item} />
          ))}
          {totalRecords !== currentDataList.length && (
            <Button
              className="self-center"
              onClick={handleOnExpand}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load more"}
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center w-full text-gray-600">
          No history data found
        </div>
      )}
    </div>
  );
}
