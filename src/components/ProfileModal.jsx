"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/action";

export default function ProfileModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsOpen(false);
      router.push("/login"); // Chỉ chuyển hướng khi logout thành công
      // Đóng dialog sau khi logout thành công
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      // Không chuyển hướng nếu có lỗi, có thể thông báo cho người dùng
    } finally {
      setIsLoggingOut(false); // Reset trạng thái loading dù thành công hay thất bại
    }
  };

  return (
    <div className="w-full px-4 flex flex-col gap-2">
      <Button
        className="bg-red-500 hover:bg-red-600 w-full"
        onClick={() => setIsOpen(true)}
      >
        Logout
      </Button>
      <div className="cursor-pointer self-end text-black hover:text-black/50 text-xs">
        Change password
      </div>
      {true && (
        <div className="fixed z-50 bg-black/40 inset-0">
          <motion.div
            initial={{ opacity: 0, top: 100 }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: -100 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="bg-white rounded-2xl p-10 flex flex-col"
          >
            <div className="flex gap-2 mb-1">
              <TriangleAlert size={60} className="text-red-600" />
              <div className="text-3xl font-bold self-end">Log out</div>
            </div>

            <div>
              Bạn có chắc chắn rằng bạn muốn đăng xuất khỏi tài khoản không?
            </div>
            <div className="mt-12 self-end flex gap-4">
              <Button
                className="text-lg bg-white border border-gray-300 text-black hover:bg-red-500 hover:text-white hover:border-red-400 w-[100px]"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <span>{isLoggingOut ? "Đang đăng xuất..." : "Logout"}</span>
              </Button>
              <Button
                className="text-lg bg-blue-500 hover:bg-blue-700 w-[100px]"
                onClick={() => setIsOpen(false)}
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
