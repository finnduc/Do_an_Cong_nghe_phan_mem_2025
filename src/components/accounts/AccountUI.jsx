"use client";
import { useEffect, useState } from "react";
import CreateAccount from "./CreateAccount";
import AccountsTable from "./AccountsTable";
import { fetchAccounts } from "@/lib/api/accounts";
import { set } from "zod";
export default function AccountUI({ data, roleData }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentData, setCurrentData] = useState(data);
  const handleCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAccounts(1, 9);
        console.log(data)
        setCurrentData(data?.metadata || []);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [refreshKey]);

  return (
    <div className="flex gap-6">
      <CreateAccount roleData={roleData} onSuccess={handleCreated} />
      <AccountsTable
        data={currentData.data}
        totalPages={currentData.totalPage}
        totalRecords={currentData.total}
        onSuccess={handleCreated}
      />
    </div>
  );
}
