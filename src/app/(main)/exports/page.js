import ExportUI from "@/components/export/ExportUI";
import { fetchExportTransaction } from "@/lib/api/export";
import { fetchEmployees } from "@/lib/api/employee";
import { fetchPartner } from "@/lib/api/partner";

export default async function ExportPage() {
  const initialResponse = await fetchExportTransaction({ page: 1, limit: 6, action: "export" });
  const initialData = initialResponse?.metadata || {};

  const employeeResponse = await fetchEmployees(1, 100);
  const customerResponse = await fetchPartner(100, 1, { partner_type: "customer" });

  return (
    <ExportUI
      data={initialData}
      employees={employeeResponse?.metadata?.data || []}
      customers={customerResponse?.metadata?.data || []}
    />
  );
}