import Stock from "@/components/stock/Stock";
import { fetchStock } from "@/lib/api/stock";


export default async function StockPage() {
  const initialData = await fetchStock(1);
  return (
    <div>
      <Stock data={initialData?.metadata}/>
    </div>
  );
}