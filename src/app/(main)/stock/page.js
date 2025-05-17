import StockUI from "@/components/stock/StockUI";
import { fetchStock } from "@/lib/api/stock";
import { fetchCatetories, fetchManufacturers } from "@/lib/api/parameters";
import { fetchPartner } from "@/lib/api/partner";
import { fetchEmployees } from "@/lib/api/employee";


export default async function StockPage() {
  const initialData = await fetchStock(1);
  const categories = await fetchCatetories();
  const manufacturers = await fetchManufacturers();
  const partners = await fetchPartner(10, 1);
  const employees = await fetchEmployees(1, 10)
  return (
    <div className="overflow-auto">
      <StockUI data={initialData?.metadata} manufacturers={manufacturers?.metadata} categories={categories?.metadata} partners={partners?.metadata.data} employees={employees?.metadata.data}/>
    </div>
  );
}