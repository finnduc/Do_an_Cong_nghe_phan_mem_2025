"use client";
import { jsonToTableFormat } from "@/lib/utils";
import ReuseTable from "@/components/ReuseTable";
import {
  deleteAccount,
  fetchAccounts,
  updateAccount,
} from "@/lib/api/accounts";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { useState, useEffect } from "react";
import { addEditButtons } from "../AddEditDeleteButtons";
import { set } from "zod";

function removeRoleId(data) {
  return data.map((item) => {
    const { role_id, ...rest } = item;
    return rest;
  });
}

export default function AccountsTable({
  data,
  totalPages,
  totalRecords,
  onSuccess,
}) {
  const [currentData, setCurrentData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    setCurrentData(data); // cập nhật lại khi props.data thay đổi
  }, [data]);

  const handleDelete = (item, index) => {
    setSelectedAccount(item);
    if (item.role === "employee") {
      setFormData({ ...item });
      setIsDeleteOpen(true);
    } else {
      toast.error(
        `You cannot delete an manager account. Please contact the administrator.`
      );
    }
  };

  const handleEdit = (item, index) => {
    if (item.role !== "manager") {
      setIsEditOpen(true);
      setSelectedAccount(item);
      setFormData({ ...item });
    } else {
      toast.error(
        `You cannot edit a manager account. Please contact the administrator.`
      );
    }
  };

  const modifiedData = addEditButtons(currentData, handleEdit, handleDelete);
  const formattedData = jsonToTableFormat(
    removeRoleId(modifiedData),
    currentPage,
    9
  );

  const getNextPage = async (page) => {
    try {
      const data = await fetchAccounts(page, 9);
      setCurrentData(data?.metadata?.data);
      setCurrentPage(page);
    } catch (e) {
      toast.error(
        e.message ||
          "An error occurred while fetching the account. Please try again or contact the administrator."
      );
    }
  };

  const handleEditSubmission = async () => {
    if (!formData.username && !formData.password) {
      return;
    }
    try {
      await updateAccount(
        selectedAccount.user_id,
        formData.username,
        formData.password
      );
      toast.success("The account has been updated successfully.");
      onSuccess();
      setIsEditOpen(false);
    } catch (e) {
      toast.error(
        "An error occurred while updating the account. Please try again or contact the administrator."
      );
    }
  };

  const handleDeleteSubmission = async () => {
    console.log(selectedAccount);
    try {
      await deleteAccount(selectedAccount.user_id);
      toast.success("The account has been deleted successfully.");
      onSuccess();
      setIsDeleteOpen(false);
    } catch (e) {
      toast.error(
        "An error occurred while deleting the account. Please try again or contact the administrator."
      );
    }
  };

  return (
    <div className="w-full">
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
          <div className="bg-white rounded-lg border shadow-md py-8 px-10">
            <div className="text-center font-semibold text-xl mb-4">
              "Edit Account"
            </div>
            <div>
              {
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      className="p-2 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="text"
                      className="p-2 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>
              }
            </div>
            <div className="flex justify-end mt-8">
              {
                <div className="flex gap-2">
                  <button
                    className=" bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    onClick={handleEditSubmission}
                  >
                    Confirm
                  </button>

                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() => {
                      setIsEditOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      )}
      {isDeleteOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg border shadow-md p-4">
            <div className="text-center font-semibold text-xl mb-4">
              Confirm deletion
            </div>
            <div>
              Are you sure you want to delete the account with username "
              {selectedAccount.username}"? This action can only be undone by
              admin.
            </div>
            <div className="flex justify-end mt-4">
              {
                <div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() => {
                      setIsDeleteOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    onClick={handleDeleteSubmission}
                  >
                    Delete
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
