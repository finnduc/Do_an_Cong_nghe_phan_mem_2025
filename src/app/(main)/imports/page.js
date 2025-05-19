import ImportUI from "@/components/import/ImportUI";
import { fetchImportTransaction } from "@/lib/api/import";
import { fetchEmployees } from "@/lib/api/employee";
import { fetchPartner } from "@/lib/api/partner";

export default async function ImportPage() {
  const initialResponse = await fetchImportTransaction({ page: 1, limit: 6, action: "import" });
  const initialData = initialResponse?.metadata || {};

  const employeeResponse = await fetchEmployees(1, 100);
  const supplierResponse = await fetchPartner(100, 1, { partner_type: "supplier" }); 

  return (
    <ImportUI
      data={initialData}
      employees={employeeResponse?.metadata?.data || []}
      suppliers={supplierResponse?.metadata?.data || []} 
    />
  );
}