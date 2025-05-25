// src/components/partners/EditPartnerForm.jsx
"use client";
import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button"; // Import Button
import { updatePartner } from "@/lib/api/partner"; // Import API update
import { toast } from "sonner"; // Import toast (nếu chưa có)
import { DialogFooter } from "@/components/ui/dialog";
export default function EditPartnerForm({
  partnerDataToEdit, // Dữ liệu partner cần sửa
  onSuccess = () => {}, // Callback khi cập nhật thành công
  onClose = () => {}, // Callback để đóng form/modal
}) {
  const [name, setName] = useState("");
  const [partnerType, setPartnerType] = useState("supplier"); // Mặc định là supplier
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Bỏ các props không cần thiết: item, setPartnerName, ... handleFormStateUpdate

  useEffect(() => {
    if (partnerDataToEdit) {
      setName(partnerDataToEdit.name || "");
      setPartnerType(partnerDataToEdit.partner_type || "supplier");
      setPhone(partnerDataToEdit.phone || "");
      setEmail(partnerDataToEdit.email || ""); // API trả về null nếu không có email
      setAddress(partnerDataToEdit.address || ""); // API trả về null nếu không có địa chỉ
    }
  }, [partnerDataToEdit]); // Chỉ phụ thuộc vào partnerDataToEdit

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !partnerType || !phone) {
      toast.error(
        "Vui lòng điền đầy đủ các trường bắt buộc: Tên, Loại, Điện thoại."
      );
      return;
    }
    if (!partnerDataToEdit || !partnerDataToEdit.partner_id) {
      toast.error("Không có thông tin đối tác để cập nhật.");
      return;
    }

    setIsLoading(true);
    const updatedPartnerData = {
      partner_id: partnerDataToEdit.partner_id,
      name: name,
      partner_type: partnerType,
      phone: phone,
      email: email || null, // Gửi null nếu email rỗng
      address: address || null, // Gửi null nếu address rỗng
    };

    try {
      await updatePartner(updatedPartnerData);
      // toast.success("Cập nhật đối tác thành công!"); // Toast sẽ được gọi ở TablePartner
      onSuccess(); // Gọi callback onSuccess
    } catch (err) {
      console.error("Error updating partner:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi cập nhật đối tác.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!partnerDataToEdit) {
    return null; // Không render gì nếu không có dữ liệu
  }

  return (
    // Không cần Toaster ở đây nếu đã có ở TablePartner hoặc layout cha
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 py-4">
      <div>
        <Label htmlFor="edit-partner-name">
          Name: <span className="text-red-500">*</span>
        </Label>
        <Input
          id="edit-partner-name"
          type="text"
          placeholder="Enter partner name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="edit-partner-type">
          Type: <span className="text-red-500">*</span>
        </Label>
        <Select
          value={partnerType}
          onValueChange={setPartnerType}
          required
          disabled={isLoading}
        >
          <SelectTrigger id="edit-partner-type">
            <SelectValue placeholder="Select partner type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="edit-partner-phone">
          Phone: <span className="text-red-500">*</span>
        </Label>
        <Input
          id="edit-partner-phone"
          type="tel"
          placeholder="Enter phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="edit-partner-email">Email:</Label>
        <Input
          id="edit-partner-email"
          type="email"
          placeholder="Enter email (Optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="edit-partner-address">Address:</Label>
        <Textarea
          id="edit-partner-address"
          rows={3} // Tăng số dòng cho dễ nhìn
          placeholder="Enter address (Optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <DialogFooter className="mt-4">
        {" "}
        {/* Thêm DialogFooter cho các nút */}
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
