import { fetchAccounts, fetchRoles } from "@/lib/api/accounts";
import AccountUI from "@/components/accounts/AccountUI";
export default async function AccountsPage() {
  const data = await fetchAccounts(1, 9);
  const roleData = await fetchRoles();
      console.log('-------------------------', process.env.EXPRESS_URL);
  return (
    <div className="text-black h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Account Management
      </h1>
      <AccountUI data={data?.metadata} roleData={roleData?.metadata} />
    </div>
  );
}
