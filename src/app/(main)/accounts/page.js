import { fetchAccounts } from "@/lib/api/accounts";
import AccountsTable from "@/components/accounts/AccountsTable";
import CreateAccount from "@/components/accounts/CreateAccount";
export default async function AccountsPage() {
  const data = await fetchAccounts(1, 9);
  return (
    <div className="text-black h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Account Management
      </h1>
      <div className="flex gap-6">
        <CreateAccount />
        <AccountsTable
          data={data?.metadata?.data}
          totalPages={data?.metadata?.totalPage}
          totalRecords={data?.metadata?.total}
        />
      </div>
    </div>
  );
}
