"use client";
import { useState } from "react";
import CreateAccount from "./CreateAccount";
import AccountsTable from "./AccountsTable";
export default function AccountUI({ data, roleData }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex gap-6">
      <CreateAccount roleData={roleData} onSuccess={handleCreated}/>
      <AccountsTable
        data={data.data}
        totalPages={data.totalPage}
        totalRecords={data.total}
      />
    </div>
  );
}
