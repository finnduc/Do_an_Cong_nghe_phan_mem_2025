import Stock from "@/components/stock/Stock";
import { fetchStock } from "@/lib/api/stock";
import { fetchCatetories, fetchManufacturers } from "@/lib/api/parameters";


export default async function StockPage() {
  const initialData = await fetchStock(1);
  const categories = await fetchCatetories();
  const manufacturers = await fetchManufacturers();
  return (
    <div>
      <Stock data={initialData?.metadata} manufacturers={manufacturers?.metadata} categories={categories?.metadata}/>
    </div>
  );
}