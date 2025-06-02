// src/components/employees/EditEmployeeForm.jsx
"use client";
import React, { useState, useEffect } from "react";
import { updateEmployee } from "@/lib/api/employee"; // API cập nhật nhân viên
import { toast } from "sonner";
// Bỏ Toaster ở đây nếu đã có ở component cha (TableEmployee)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog"; // Import DialogFooter

function EditEmployeeForm({
  employeeDataToEdit, // Dữ liệu nhân viên cần sửa
  onSuccess = () => {},   // Callback khi cập nhật thành công
  onClose = () => {}      // Callback để đóng form/modal
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // State cho lỗi form validation hoặc API

  useEffect(() => {
    if (employeeDataToEdit) {
      setName(employeeDataToEdit.name || "");
      setEmail(employeeDataToEdit.email || "");
      setPhone(employeeDataToEdit.phone || ""); // API có thể trả về null cho phone
    }
  }, [employeeDataToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset lỗi trước mỗi lần submit

    if (!name.trim() || !email.trim()) {
      toast.error("Tên và Email là bắt buộc.");
      setError("Tên và Email là bắt buộc.");
      return;
    }
    if (!employeeDataToEdit || !employeeDataToEdit.employee_id) {
        toast.error("Không có thông tin nhân viên để cập nhật.");
        setError("Không có thông tin nhân viên để cập nhật.");
        return;
    }

    setIsLoading(true);
    const updatedEmployeeData = {
      employee_id: employeeDataToEdit.employee_id,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null, // Gửi null nếu phone rỗng
      // user_id không nên cho sửa ở đây, nó nên được quản lý ở trang Account
      // user_id: employeeDataToEdit.user_id,
    };

    try {
      const response = await updateEmployee(updatedEmployeeData);
      toast.success(response?.message || "Cập nhật nhân viên thành công!");
      onSuccess(); // Gọi callback thành công (sẽ đóng modal và refresh bảng)
    } catch (err) {
      console.error("Error updating employee:", err);
      const errorMessage = err.message || "Đã xảy ra lỗi khi cập nhật nhân viên.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!employeeDataToEdit) {
    return null; // Hoặc một thông báo lỗi/loading nếu cần
  }

  return (
    // Bỏ div font-sans và Toaster nếu không cần thiết ở đây
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 py-4">
      <div>
        <Label htmlFor="edit-employee-name" className="mb-1 block">
          Name : <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="edit-employee-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
          placeholder="Enter name"
        />
      </div>
      <div>
        <Label htmlFor="edit-employee-email" className="mb-1 block">
          Email : <span className="text-red-500">*</span>
        </Label>
        <Input
          type="email"
          id="edit-employee-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          placeholder="Enter email"
        />
      </div>
      <div>
        <Label htmlFor="edit-employee-phone" className="mb-1 block">Phone :</Label>
        <Input
          type="tel"
          id="edit-employee-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading}
          placeholder="Enter phone (optional)"
        />
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>} {/* Hiển thị lỗi nhỏ gọn hơn */}
      
      <DialogFooter className="mt-6 pt-4 border-t"> {/* Thêm border-t để ngăn cách */}
        <Button
          type="button"
          variant="outline"
          onClick={onClose} // Gọi onClose khi nhấn Cancel
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default EditEmployeeForm;