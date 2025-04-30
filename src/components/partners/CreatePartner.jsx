"use client";

import React, { useState } from "react";
import { createPartner } from "@/lib/api/partner";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function CreatePartnerForm({ onSuccess = () => {} }) {
  const [name, setName] = useState("");
  const [partnerType, setPartnerType] = useState("supplier");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setName("");
    setPartnerType("supplier");
    setPhone("");
    setEmail("");
    setAddress("");
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const partnerData = {
      name: name,
      partner_type: partnerType,
      phone: phone,
      email: email || null,
      address: address || null,
    };
    console.log("Sending partner data:", partnerData);

    try {
      const response = await createPartner(partnerData);

      toast.success(response?.message || "Thêm đối tác thành công!");
      resetForm();
      onSuccess();
    } catch (err) {
      console.error("Error creating partner:", err);
      const errorMessage = err.message || "Đã xảy ra lỗi khi thêm đối tác.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans h-full">
      <Toaster position="top-right" richColors />
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 max-w-md h-full flex flex-col">
        <h2 className="text-center text-xl md:text-2xl font-semibold text-gray-800 mb-1">
          Tạo Đối Tác Mới
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Nhập thông tin để thêm đối tác mới vào hệ thống.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow space-y-4"
        >
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên đối tác: <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nhập tên đối tác"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label
              htmlFor="partnerType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loại đối tác: <span className="text-red-500">*</span>
            </Label>
            <Select
              value={partnerType}
              onValueChange={setPartnerType}
              required
              disabled={isLoading}
            >
              <SelectTrigger id="partnerType">
                <SelectValue placeholder="Chọn loại đối tác" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supplier">Nhà cung cấp</SelectItem>
                <SelectItem value="customer">Khách hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số điện thoại: <span className="text-red-500">*</span>
            </Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Nhập số điện thoại"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email (không bắt buộc)"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Địa chỉ:
            </Label>
            <Textarea
              id="address"
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ (không bắt buộc)"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            type="submit"
            className="mt-auto bg-blue-500 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Đang thêm..." : "Thêm Đối Tác"}
          </Button>
        </form>
      </div>
    </div>
  );
}
export default CreatePartnerForm;


