"use client";
import { Button } from "../ui/button";
import HistoryCard from "./HistoryCard";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { fetchHistories } from "@/lib/api/history";

export default function HistoryUI({
  dataList,
}) {
  const [currentDataList, setCurrentDataList] = useState(dataList)
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const handleOnExpand = async () => {
    setIsLoading(true);
    try {
      const newData = await fetchHistories(currentPage + 1);
      setCurrentDataList(prev => [...prev, ...newData])
      setCurrentPage(currentPage + 1)
    } catch (e) {
      console.log(e);
      toast.error(
        "Đã có lỗi xảy ra khi lấy dữ liệu lịch sử, vui lòng thử lại hoặc liên hệ với nhân viên kĩ thuật."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex divide-x">
      <Toaster />
      <div className="w-[300px] flex flex-col gap-4 pr-4">
        <div className="text-sm">Ngày bắt đầu: </div>
        <input type="date" className="p-2 shadow-sm border-[1px] rounded-md" />
        <div className="text-sm">Ngày cuối: </div>
        <input type="date" className="p-2 shadow-sm border-[1px] rounded-md" />
      </div>
      <div className="flex flex-col overflow-auto gap-2 h-[550px] pl-4 w-full py-2">
        {currentDataList.map((item, index) => (
          <HistoryCard key={index} data={item} />
        ))}
        <Button className="self-center" onClick={handleOnExpand} disabled={isLoading}>
          {isLoading ? "Đang tải" : "Xem thêm"}
        </Button>
      </div>
    </div>
  );
}
