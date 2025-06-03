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
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteDenied, setDeleteDenied] = useState(false);
  const [editDenied, setEditDenied] = useState(false);

  useEffect(() => {
    setCurrentData(data); // cập nhật lại khi props.data thay đổi
  }, [data]);

  const handleDelete = (item, index) => {
    setSelectedAccount(item);
    if (item.role === "employee") {
      setDeleteDenied(false);
      setDeleteMessage(
        `Are you sure you want to delete the account with username "${item.username}"? This action can only be undone by admin.`
      );
    } else {
      setDeleteDenied(true);
      setDeleteMessage(
        `You cannot delete an manager account. Please contact the administrator.`
      );
    }
    setFormData({ ...item });
    setIsDeleteOpen(true);
  };

  const handleEdit = (item, index) => {
    setIsEditOpen(true);
    if (item.role === "manager") {
      setEditDenied(true);
    } else {
      setEditDenied(false);
    }
    setSelectedAccount(item);
    setFormData({ ...item });
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
      setSuccessMessage("The account has been updated successfully.");
      onSuccess();
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
      setSuccessMessage("The account has been deleted successfully.");
      onSuccess();
    } catch (e) {
      toast.error(
        "An error occurred while deleting the account. Please try again or contact the administrator."
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
          <div className="bg-white rounded-lg border shadow-md py-8 px-10">
            <div className="text-center font-semibold text-xl mb-4">
              {editDenied ? "Edit Denied" : "Edit Account"}
            </div>
            {!editDenied ? (
              <div>
                {successMessage ? (
                  <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
                    {successMessage}
                  </div>
                ) : (
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
                )}
              </div>
            ) : (
              <div className="text-left font-medium text-xl">
                You cannot edit a manager account.<br></br> Please contact the
                administrator or the owner.
              </div>
            )}
            <div className="flex justify-end mt-8">
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
                <div className="flex gap-2">
                  {!editDenied && (
                    <button
                      className=" bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                      onClick={handleEditSubmission}
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() => {
                      setIsEditOpen(false);
                      setSuccessMessage(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isDeleteOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg border shadow-md p-4">
            <div className="text-center font-semibold text-xl mb-4">
              {deleteDenied ? "Delete Denied" : "Confirm deletion"}
            </div>
            {successMessage ? (
              <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
                {successMessage}
              </div>
            ) : (
              <div>{deleteMessage}</div>
            )}
            <div className="flex justify-end mt-4">
              {successMessage ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    setIsDeleteOpen(false);
                    setSuccessMessage(null);
                  }}
                >
                  Done
                </button>
              ) : (
                <div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() => {
                      setIsDeleteOpen(false);
                      setSuccessMessage(null);
                    }}
                  >
                    Cancel
                  </button>
                  {!deleteDenied && (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                      onClick={handleDeleteSubmission}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
