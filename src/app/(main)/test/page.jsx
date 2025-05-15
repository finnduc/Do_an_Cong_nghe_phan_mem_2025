import ExportTest from "@/components/export/ExportTest";
import TransactionTable from "@/components/export/TransactionTable";
import { fetchExportTransaction } from "@/lib/api/export";



export default async function ExportPage() {
  const exportTransactionData = await fetchExportTransaction(1);
  return (
    <ExportTest data={exportTransactionData} />
  );
}
