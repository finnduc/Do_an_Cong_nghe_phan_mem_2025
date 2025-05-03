// src/components/employees/CreateEmployee.jsx
"use client";
import React, { useState } from "react";
import { createEmployee } from "@/lib/api/employee";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

function CreateEmployeeForm({ onSuccess = () => {} }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // State hasAccount không ảnh hưởng đến việc gửi API nữa
  const [hasAccount, setHasAccount] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setHasAccount(false);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Tạm thời bỏ qua kiểm tra hasAccount theo yêu cầu trước đó
    // if (hasAccount) { ... }

    if (!name || !email) {
      toast.error("Vui lòng nhập Tên và Email (bắt buộc).");
      return;
    }

    setIsLoading(true);
    setError(null);

    // --- CẬP NHẬT TẠI ĐÂY ---
    // Chuẩn bị dữ liệu gửi đi
    const employeeData = {
      name: name,
      email: email || null,
      phone: phone || null,
      // Luôn gửi null cho trường liên kết tài khoản
      // *** LƯU Ý: Đảm bảo 'account_id' là tên key mà backend mong đợi ***
      user_id: null,
      // -----------------------------------------------------------------//
    };
    // -----------------------

    console.log("Sending employee data (with account_id: null):", employeeData);

    try {
      const response = await createEmployee(employeeData);
      toast.success(response?.message || "Thêm nhân viên thành công!");
      resetForm();
      onSuccess();
    } catch (err) {
      console.error("Error creating employee:", err);
      const errorMessage = err.message || "Đã xảy ra lỗi khi thêm nhân viên.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Giữ nguyên JSX và CSS ---
  return (
    <div className="font-sans">
      <Toaster position="top-right" richColors />
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 max-w-md flex flex-col ">
        <h2 className="text-center text-xl md:text-2xl font-semibold text-gray-800 mb-3">
          Create employee
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Create employee here. If the employee already has an account, click on
          'Employee already has an account'.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name : <span className="text-red-500">*</span>
            </label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email : <span className="text-red-500">*</span>
            </label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          {/* Phone Input */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone :
            </label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          {/* hasAccount Checkbox */}
          <div className="flex items-center mb-4">
            <input id="hasAccount" name="hasAccount" type="checkbox" checked={hasAccount} onChange={(e) => setHasAccount(e.target.checked)} disabled={isLoading} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer" />
            <label htmlFor="hasAccount" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Employee already has an account
            </label>
          </div>
          {/* Error display */}
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          {/* Submit Button */}
          <button type="submit" disabled={isLoading} className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEmployeeForm;