
"use client";


import React, { useState } from "react";

function CreatePartnerForm() {

  const [name, setName] = useState(""); 
  const [partnerType, setPartnerType] = useState("supplier"); 
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(""); 

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Partner Form submitted:", { name, partnerType, phone, email, address });
    alert("Đã thêm đối tác!"); 
  };

  return (

    <div className="font-sans h-full">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 max-w-md h-full flex flex-col">

        <h2 className="text-center text-xl md:text-2xl font-semibold text-gray-800 mb-1">
          Tạo Đối Tác Mới
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Nhập thông tin để thêm đối tác mới vào hệ thống.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên đối tác: <span className="text-red-500">*</span>
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
              htmlFor="partnerType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loại đối tác: <span className="text-red-500">*</span>
            </label>
            <select
              id="partnerType"
              value={partnerType}
              onChange={(e) => setPartnerType(e.target.value)}
              required 
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white" // Thêm bg-white để đảm bảo nền trắng
            >
              <option value="supplier">Nhà cung cấp</option>
              <option value="customer">Khách hàng</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số điện thoại: <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>


          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}

              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

  
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Địa chỉ:
            </label>
            <textarea
              id="address"
              rows="3" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <button
            type="submit"
            className="mt-auto px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Thêm Đối Tác
          </button>
        </form>
      </div>
    </div>
  );
}

// Cập nhật tên khi export
export default CreatePartnerForm;