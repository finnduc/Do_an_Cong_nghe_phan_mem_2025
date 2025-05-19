"use client";
import { Settings } from "lucide-react";
import { useState } from "react";

export default function SettingUI({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  const handleChangePassword = async () => {
        console.log(formData);
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (formData.oldPassword === formData.newPassword) {
      setError("New password cannot be the same as the old password.");
      return;
    }

  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <Settings size={20} /> Settings
      </h2>
      <div>
        <p className="text-gray-600 mb-2">
          <strong>Username:</strong> {user.userName}
        </p>
        <p className="text-gray-600">
          <strong>Password:</strong> **********
        </p>
      </div>
      <div className="text-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
          onClick={() => setIsOpen(true)}
        >
          Change password
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg border shadow-md p-6 flex flex-col gap-2">
            <div className="text-center text-lg font-semibold text-blue-950">
              Change Password
            </div>
            <div>
              <div className="text-gray-600 text-sm font-medium">
                Old Password
              </div>
              <input
                className="border rounded-md p-2"
                onChange={(e) =>
                  setFormData({ ...formData, oldPassword: e.target.value })
                }
              />
            </div>
            <div>
              <div className="text-gray-600 text-sm font-medium">
                New Password
              </div>
              <input
                className="border rounded-md p-2"
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />
            </div>
            <div>
              <div
                className="text-gray-600 text-sm font-medium"
                
              >
                Confirm Password
              </div>
              <input className="border rounded-md p-2" onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }/>
            </div>
            {error && <div className="text-red-500 w-[200px] text-xs">{error}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleChangePassword}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                onClick={() => {
                  setIsOpen(false);
                  setFormData({});
                  setError(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
