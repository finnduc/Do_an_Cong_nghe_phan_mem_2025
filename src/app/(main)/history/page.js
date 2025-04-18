import HistoryUI from "@/components/history/HistoryUI";
import { fetchHistories } from "@/lib/api/history";

export default async function HistoryPage() {
  const initialData = await fetchHistories(1)
  return <div className="text-black h-full">
    <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Lịch sử
      </h1>
    <HistoryUI dataList={initialData.metadata.data} />
  </div>;
}
