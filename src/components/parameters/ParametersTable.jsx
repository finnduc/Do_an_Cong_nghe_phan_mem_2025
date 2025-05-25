"use client";
import { jsonToTableFormat } from "@/lib/utils";
import ReuseTable from "../ReuseTable";
import { useState } from "react";
import { Button } from "../ui/button";
import { addEditButtons } from "../AddEditDeleteButtons";

export default function ParametersTable({
  children,
  title,
  data,
  scrollAble,
  handleDeleteParameters,
  handleEditParameters,
  handleCreateParameters, // New prop for handling create action
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false); // State for Create modal
  const [isEditOpen, setIsEditOpen] = useState(false); // State for Edit modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // State for Delete modal
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item for edit/delete
  const [selectedIndex, setSelectedIndex] = useState(null); // Track index for edit/delete


  const handleEdit = (item, index) => {
    setSelectedItem(item);
    setSelectedIndex(index);
    setIsEditOpen(true);
  };

  const handleDelete = (item, index) => {
    setSelectedItem(item);
    setSelectedIndex(index);
    setIsDeleteOpen(true);
  };

  const modifiedData = addEditButtons(data, handleEdit, handleDelete);
  const formattedData = jsonToTableFormat(modifiedData);

  const handleCreateSubmit = () => {
    if (handleCreateParameters) {
      handleCreateParameters();
    }
    setIsCreateOpen(false);
  };

  // Handle edit submission
  const handleEditSubmit = () => {
    if (
      handleEditParameters &&
      selectedItem !== null &&
      selectedIndex !== null
    ) {
      handleEditParameters(selectedItem, selectedIndex);
    }
    setIsEditOpen(false);
    setSelectedItem(null);
    setSelectedIndex(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (
      handleDeleteParameters &&
      selectedItem !== null &&
      selectedIndex !== null
    ) {
      handleDeleteParameters(selectedItem, selectedIndex);
    }
    setIsDeleteOpen(false);
    setSelectedItem(null);
    setSelectedIndex(null);
  };

  return (
    <div>
      {/* Title and Create Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <Button
          className="text-white bg-blue-500 hover:bg-blue-700"
          onClick={() => setIsCreateOpen(true)}
        >
          Add {title}
        </Button>
      </div>

      {/* Table */}
      <div className="flex gap-6">
        <ReuseTable
          columns={formattedData.columns}
          rows={formattedData.rows}
          scrollMode={scrollAble}
          maxLength={10}
          showTotal={false}
        />
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed z-50 bg-black/40 inset-0 flex items-center justify-center">
          <div className="flex flex-col bg-white rounded-lg border-input px-10 py-8 shadow-lg max-h-[300px] w-full max-w-md">
            <div className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Create {title}
            </div>
            {children({ item: null, index: null })}{" "}
            {/* Render form passed as children */}
            <div className="mt-6 flex gap-2 self-end">
              <Button
                className="text-white bg-blue-500 hover:bg-blue-700"
                onClick={handleCreateSubmit}
              >
                Create
              </Button>
              <Button
                className="border-gray-200 border-[1px] bg-white text-black hover:bg-gray-100"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed z-50 bg-black/40 inset-0 flex items-center justify-center">
          <div className="flex flex-col bg-white rounded-lg border-input px-10 py-8 shadow-lg max-h-[300px] w-full max-w-md">
            <div className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Edit {title}
            </div>
            {/* Pass selectedItem to children for pre-filling form */}
            {children && typeof children === "function"
              ? children({ item: selectedItem, index: selectedIndex })
              : children}
            <div className="mt-6 flex gap-2 self-end">
              <Button
                className="text-white bg-blue-500 hover:bg-blue-700"
                onClick={handleEditSubmit}
              >
                Save
              </Button>
              <Button
                className="border-gray-200 border-[1px] bg-white text-black hover:bg-gray-100"
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedItem(null);
                  setSelectedIndex(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed z-50 bg-black/40 inset-0 flex items-center justify-center">
          <div className="flex flex-col bg-white rounded-lg border-input px-10 py-8 shadow-lg w-full max-w-md">
            <div className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Confirm Delete
            </div>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete this {title.toLowerCase()}?
            </p>
            <div className="flex gap-2 self-end">
              <Button
                className="text-white bg-red-500 hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedItem(null);
                  setSelectedIndex(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
