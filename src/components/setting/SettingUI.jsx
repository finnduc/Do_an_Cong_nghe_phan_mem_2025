"use client";
import { CogIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function SettingUI({ user }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <CogIcon className="w-6 h-6" /> Setting
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
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Change password
        </button>
      </div>
    </div>
  );
}
