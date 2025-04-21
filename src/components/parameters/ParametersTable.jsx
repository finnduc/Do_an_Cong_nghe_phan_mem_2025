"use client";
import { jsonToTableFormat } from "@/lib/utils";
import ReuseTable from "../ReuseTable";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { addEditButtons } from "../AddEditDeleteButtons";


export default function ParametersTable({ title, data }) {
  data = addEditButtons(data);
  const [newParameter, setNewParameter] = useState("");
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
        <ReuseTable columns={formattedData.columns} rows={formattedData.rows} />
      </div>
      {isOpen && (
        <div className="fixed z-50 bg-black/40 inset-0 flex items-center justify-center">
          <div className="flex flex-col bg-white rounded-lg border-input px-10 py-8 shadow-lg max-h-[300px]">
            <div className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Create {title}
            </div>
            <label htmlFor="name">{title} name:</label>
            <Input
              id="name"
              type="text"
              value={newParameter}
              onChange={(e) => setNewParameter(e.target.value)}
            />
            <div className="mt-6 flex gap-2 self-end">
              <Button
                className="border-gray-200 border-[1px] bg-white text-black hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="text-white bg-blue-500 hover:bg-blue-700"
                onClick={() => console.log(newParameter)}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
