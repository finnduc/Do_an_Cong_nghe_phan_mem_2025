import StockUI from "@/components/stock/StockUI";
import { fetchStock } from "@/lib/api/stock";
import { fetchCatetories, fetchManufacturers } from "@/lib/api/parameters";
import { fetchPartner } from "@/lib/api/partner";
import { fetchEmployees } from "@/lib/api/employee";

export default async function StockPage() {
  const initialData = await fetchStock(1, 8, {}, { cache: "no-store" });
  const categories = await fetchCatetories({ cache: "no-store" });
  const manufacturers = await fetchManufacturers({ cache: "no-store" });
  const employees = await fetchEmployees(1, 10000, {}, { cache: "no-store" });
  const partners = await fetchPartner(10000, 1, {}, { cache: "no-store" });
  return (
    <div className="overflow-auto">
      <StockUI
        data={initialData?.metadata}
        manufacturers={manufacturers?.metadata}
        categories={categories?.metadata}
        employees={employees?.metadata?.data}
        partners={partners?.metadata?.data}
      />
    </div>
  );
}
