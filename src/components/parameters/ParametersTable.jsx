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
}) {
  const handleDelete = (item, index) => handleDeleteParameters(item, index);
  const handleEdit = (item, index) => handleEditParameters(item, index);
  data = addEditButtons(data, handleEdit, handleDelete);
  const [isOpen, setIsOpen] = useState(false);
  const formattedData = jsonToTableFormat(data);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <Button
          className="text-white bg-blue-500 hover:bg-blue-700"
          onClick={() => setIsOpen(true)}
        >
          Add {title}
        </Button>
      </div>
      <div className="flex gap-6">
        <ReuseTable
          columns={formattedData.columns}
          rows={formattedData.rows}
          scrollMode={scrollAble}
        />
      </div>
      {isOpen && (
        <div className="fixed z-50 bg-black/40 inset-0 flex items-center justify-center">
          <div className="flex flex-col bg-white rounded-lg border-input px-10 py-8 shadow-lg max-h-[300px] w-full max-w-md">
            <div className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Create {title}
            </div>
            {children()}
            <div className="mt-6 flex gap-2 self-end">
              <Button
                className="text-white bg-blue-500 hover:bg-blue-700"
                onClick={() => {
                  console.log("Submitted");
                  setIsOpen(false);
                }}
              >
                Create
              </Button>
              <Button
                className="border-gray-200 border-[1px] bg-white text-black hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
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
