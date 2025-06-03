"use client";
import React, { useState, useEffect } from "react";
import { createEmployee, GetAllUser } from "@/lib/api/employee";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function CreateEmployeeForm({ onSuccess = () => {} }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hasAccount, setHasAccount] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setHasAccount(false);
    setSelectedUserId("");
    setError(null);
  };

  useEffect(() => {
    async function fetchUsers() {
      setIsLoadingUsers(true);
      try {
        const response = await GetAllUser(1, 1000);
        if (response.metadata.data) {
          setUsersList(response.metadata.data);
        } else {
          setUsersList([]);
        }
      } catch (err) {
        toast.error("Unable to load user list.");
        setUsersList([]);
      } finally {
        setIsLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  const handleHasAccountChange = (checked) => {
    setHasAccount(checked);
    if (!checked) {
      setSelectedUserId("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !email) {
      toast.error("Please enter Name and Email (required).");
      return;
    }

    if (hasAccount && !selectedUserId) {
      toast.error("Please select a user account or uncheck and leave blank.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const employeeData = {
      name: name,
      email: email,
      phone: phone || null,
      user_id: hasAccount && selectedUserId ? selectedUserId : null,
    };

    try {
      const response = await createEmployee(employeeData);
      toast.success(response?.message || "Add employee successfully!");
      onSuccess();
      resetForm();
    } catch (err) {
      toast.error("An error occurred while adding employee.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 max-w-md flex flex-col ">
        <h2 className="text-center text-xl md:text-2xl font-semibold text-gray-800 mb-1">
          Create employee
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Create employee here. If the employee already has an account, click on
          the checkbox and select an account.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name : <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email : <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone :
            </Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <Checkbox
              id="hasAccount"
              checked={hasAccount}
              onCheckedChange={handleHasAccountChange}
              disabled={isLoading}
            />
            <div className="flex-1">
              <Select
                value={selectedUserId}
                onValueChange={setSelectedUserId}
                disabled={!hasAccount || isLoading || isLoadingUsers}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user account" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingUsers ? (
                    <SelectItem value="loading" disabled>
                      Loading users...
                    </SelectItem>
                  ) : usersList.length > 0 ? (
                    usersList.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {user.username}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users" disabled>
                      Unable to load
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateEmployeeForm;
