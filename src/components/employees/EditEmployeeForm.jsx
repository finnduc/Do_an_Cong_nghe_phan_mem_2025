// src/components/employees/EditEmployeeForm.jsx
"use client";
import React, { useState, useEffect } from "react";
import { updateEmployee } from "@/lib/api/employee";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function EditEmployeeForm({
  employeeDataToEdit, // Dữ liệu nhân viên cần sửa
  onSuccess = () => {},   // Callback khi cập nhật thành công
  onClose = () => {}      // Callback để đóng form/modal
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employeeDataToEdit) {
      setName(employeeDataToEdit.name || "");
      setEmail(employeeDataToEdit.email || "");
      setPhone(employeeDataToEdit.phone || "");
    }
  }, [employeeDataToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !email) {
      toast.error("Vui lòng nhập Tên và Email (bắt buộc).");
      return;
    }
    if (!employeeDataToEdit || !employeeDataToEdit.employee_id) {
        toast.error("Không có thông tin nhân viên để cập nhật.");
        return;
    }

    setIsLoading(true);
    setError(null);

    const updatedEmployeeData = {
      employee_id: employeeDataToEdit.employee_id, // Quan trọng: phải có employee_id
      name: name,
      email: email,
      phone: phone || null,
      // user_id: employeeDataToEdit.user_id, // Giữ lại user_id gốc nếu có, không cho sửa qua form này
    };

    try {
      const response = await updateEmployee(updatedEmployeeData);
      toast.success(response?.message || "Cập nhật nhân viên thành công!");
      onSuccess();
      onClose();
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
    <div className="font-sans">
      <Toaster position="top-right" richColors /> {/* Đặt Toaster ở đây hoặc ở component cha cao hơn */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 max-w-md flex flex-col">
        <h2 className="text-center text-xl md:text-2xl font-semibold text-gray-800 mb-3">
          Edit Employee
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Update employee information below.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="edit-employee-name">
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
            <Label htmlFor="edit-employee-email">
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
            <Label htmlFor="edit-employee-phone">Phone :</Label>
            <Input
              type="tel"
              id="edit-employee-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              placeholder="Enter phone (optional)"
            />
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          
          <div className="flex justify-end space-x-3 mt-6">
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
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEmployeeForm;