import ReuseTable from "@/components/ReuseTable";

import { fetchAccounts } from "@/lib/api/accounts";
import AccountsTable from "@/components/accounts/AccountsTable";
import CreateUser from "@/components/accounts/CreateUser";
export default async function AccountsPage() {
  const data = await fetchAccounts(1);
  return (
    <div className="text-black h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Quản lí tài khoản
      </h1>
      <div className="flex gap-6">
        <CreateUser />
        <AccountsTable
          data={data?.metadata?.data}
          totalPages={data?.metadata?.totalPage}
          totalRecords={data?.metadata?.total}
        />
      </div>
    </div>
  );
}
