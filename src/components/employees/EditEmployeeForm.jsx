"use client";
import React, { useState, useEffect } from "react";
import { updateEmployee } from "@/lib/api/employee";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
function EditEmployeeForm({
  employeeDataToEdit,
  onSuccess = () => {},
  onClose = () => {},
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
    event.preventDefault(); // tránh tải lại trang
    setError(null);
    setIsLoading(true);
    const updatedEmployeeData = {
      employee_id: employeeDataToEdit.employee_id,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
    };

    try {
      const response = await updateEmployee(updatedEmployeeData);
      toast.success(response?.message || "Employee update successful!");
      onSuccess();
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi cập nhật nhân viên.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!employeeDataToEdit) {
    return null;
  }

  return (
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
        <Label htmlFor="edit-employee-phone" className="mb-1 block">
          Phone :
        </Label>
        <Input
          type="tel"
          id="edit-employee-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading}
          placeholder="Enter phone "
        />
      </div>
      

      <DialogFooter className="mt-6 pt-4 border-t">
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
      </DialogFooter>
    </form>
  );
}

export default EditEmployeeForm;
