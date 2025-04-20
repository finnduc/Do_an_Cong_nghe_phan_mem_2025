"use client";
import React, { useState } from "react";

function CreateEmployeeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hasAccount, setHasAccount] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", { name, email, phone, hasAccount });
    alert("Đã thêm nhân viên!");
  };

  return (
    <div className="font-sans">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 max-w-md flex flex-col">
        <h2 className="text-center text-xl md:text-2xl font-semibold text-gray-800 mb-8">
          Tạo nhân viên
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Tạo nhân viên ở đây, nếu đã có tài khoản thì click nhân viên.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên :
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email :
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nhập số điện thoại :
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              id="hasAccount"
              name="hasAccount"
              type="checkbox"
              checked={hasAccount}
              onChange={(e) => setHasAccount(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="hasAccount"
              className="ml-2 block text-sm text-gray-700 cursor-pointer"
            >
              Nhân viên đã có tài khoản
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Thêm
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEmployeeForm;
