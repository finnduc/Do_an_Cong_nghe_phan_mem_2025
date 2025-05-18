"use client";

import { Button } from "../ui/button";

export default function SettingUI({ user }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-2">Setting</h1>
      </div>
      <div className="px-4 pt-4 flex gap-10 bg-white rounded-lg border shadow-lg min-h-[570px] flex-col">
        <div>Username: {user.userName}</div>
        <div>Password: ***********</div>
        <Button className="text-blue-500 border bg-white border-blue-500 hover:bg-blue-500 hover:text-white">
          Change password
        </Button>
      </div>
    </div>
  );
}
