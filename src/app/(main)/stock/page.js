import StockUI from "@/components/stock/StockUI";
import { fetchStock } from "@/lib/api/stock";
import { fetchCatetories, fetchManufacturers } from "@/lib/api/parameters";
import { fetchPartner } from "@/lib/api/partner";
import { fetchEmployees } from "@/lib/api/employee";


export default async function StockPage() {
  const initialData = await fetchStock(1);
  const categories = await fetchCatetories();
  const manufacturers = await fetchManufacturers();
  const employees = await fetchEmployees(1, 10000);
  const partners = await fetchPartner(10000, 1);
  return (
    <div className="overflow-auto">
      <StockUI data={initialData?.metadata} manufacturers={manufacturers?.metadata} categories={categories?.metadata} employees={employees?.metadata?.data} partners={partners?.metadata?.data}/>
    </div>
  );
}