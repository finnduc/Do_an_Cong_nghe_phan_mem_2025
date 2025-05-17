"use client";
import { jsonToTableFormat } from "@/lib/utils";
import ReuseTable from "@/components/ReuseTable";
import { fetchAccounts, updateAccount } from "@/lib/api/accounts";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { useState } from "react";
import { addEditButtons } from "../AddEditDeleteButtons";

function removeRoleId(data) {
  return data.map(item => {
    const { role_id, ...rest } = item;
    return rest;
  });
}

export default function AccountsTable({ data, totalPages, totalRecords }) {
  const [currentData, setCurrentData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleDelete = (item, index) => {
    setSelectedAccount(item);
    setIsDeleteOpen(true);
  };

  const handleEdit = (item, index) => {
    setSelectedAccount(item);
    setFormData({ ...item });
    setIsEditOpen(true);
  };

  const modifiedData = addEditButtons(currentData, handleEdit, handleDelete);
  const formattedData = jsonToTableFormat(removeRoleId(modifiedData), currentPage, 9);

  const getNextPage = async (page) => {
    try {
      const data = await fetchAccounts(page, 9);
      setCurrentData(data?.metadata?.data);
      setCurrentPage(page);
    } catch (e) {
      setErrorMessage(e.message || "Đã xảy ra lỗi không xác định.");
      toast.error(
        "Có lỗi xảy ra khi tạo truy vấn SQL. Vui lòng thử lại hoặc liên hệ với người quản trị."
      );
    }
  };

  const handleEditSubmission = async () => {
    if (!formData.username && !formData.password) {
      return
    }
    try {
      const data = await updateAccount(selectedAccount.user_id, formData.username, formData.password);
      setSuccessMessage('The account has been updated successfully.');
      const updatedData = currentData.map((account) =>
        account.user_id === formData.user_id ? formData : account
      );
      setCurrentData(updatedData);
    } catch (e) {
      setErrorMessage(e.message || "Đã xảy ra lỗi không xác định.");
      toast.error(
        "Có lỗi xảy ra khi tạo truy vấn SQL. Vui lòng thử lại hoặc liên hệ với người quản trị."
      );
    }
  };
  
  return (
    <div className="w-full">
      <Toaster />
      <ReuseTable
        columns={formattedData.columns}
        rows={formattedData.rows}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={getNextPage}
      />
      {isEditOpen && formData && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg border shadow-md p-4">
            <div className="text-center font-semibold text-xl mb-4">
              Edit Account
            </div>
            {successMessage ? (
              <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
                {successMessage}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    className="p-2 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="text"
                    className="p-2 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end mt-4">
              {successMessage ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    setIsEditOpen(false);
                    setSuccessMessage(null);
                  }}
                >
                  Done
                </button>
              ) : (
                <>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() => {
                      setIsEditOpen(false);
                      setSuccessMessage(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    onClick={handleEditSubmission}
                  >
                    Confirm
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {isDeleteOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg border shadow-md p-4">
            <div className="text-center font-semibold text-xl mb-4">
              Confirm Delete
            </div>
            <div>
              Are you sure you want to delete the account with username "{selectedAccount.username}"? <br></br> This action can only be undone by admin.
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  const updatedData = currentData.filter(
                    (account) => account.user_id !== selectedAccount.user_id
                  );
                  setCurrentData(updatedData);
                  setIsDeleteOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}