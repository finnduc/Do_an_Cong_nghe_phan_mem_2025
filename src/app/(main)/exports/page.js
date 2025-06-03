import ExportUI from "@/components/export/ExportUI";
import { fetchExportTransaction } from "@/lib/api/export";
import { fetchEmployees } from "@/lib/api/employee";
import { fetchPartner } from "@/lib/api/partner";

export default async function ExportPage() {
  const initialData = await fetchExportTransaction(1);    
    const employees = await fetchEmployees(1, 10000);
    const partners = await fetchPartner(10000, 1);
    return (
      <div className="overflow-auto">
        <ExportUI data={initialData?.metadata} employees={employees?.metadata?.data} partners={partners?.metadata?.data}/>
      </div>
    );
  }