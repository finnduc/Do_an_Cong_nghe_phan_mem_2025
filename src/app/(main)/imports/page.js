import ImportUI from "@/components/import/ImportUI";
import { fetchImportTransaction } from "@/lib/api/import";
import { fetchEmployees } from "@/lib/api/employee";
import { fetchPartner } from "@/lib/api/partner";

export default async function ImportPage() {
  const initialData = await fetchImportTransaction(1, 8, {}, { cache: "no-store" });    
    const employees = await fetchEmployees(1, 10000);
    const partners = await fetchPartner(10000, 1);
    return (
      <div className="overflow-auto">
        <ImportUI data={initialData?.metadata} employees={employees?.metadata?.data} partners={partners?.metadata?.data}/>
      </div>
    );
  }