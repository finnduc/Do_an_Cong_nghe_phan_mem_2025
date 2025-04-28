"use client";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { get_cookie } from "@/lib/cookie/action";
import { User } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { logout } from "@/lib/auth/action";

export default function TopBarButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const cookies = await get_cookie();
      const { user: storedUser } = cookies || {};
      setUser(storedUser);
    };
    fetchUser();
  }, []);
  const userName = user?.userName;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      // Không chuyển hướng nếu có lỗi, có thể thông báo cho người dùng
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };
  return (
    <div className="flex gap-2 mr-5 items-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="p-2 rounded-full cursor-pointer text-blue-500 border-blue-500 border-2 hover:bg-blue-500 hover:text-white">
            <User />
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-64 bg-white shadow-lg rounded-lg flex flex-col items-center gap-3">
          <h4 className="text-center text-blue-500">Username: {userName}</h4>
          <Button
            className="bg-red-500 hover:bg-red-600 w-full"
            onClick={() => setIsOpen(true)}
          >
            Logout
          </Button>
          <div className="cursor-pointer self-end text-black hover:text-black/50 text-xs">
            Change password
          </div>
        </HoverCardContent>
      </HoverCard>
      {isOpen && (
        <div className="fixed z-50 bg-black/40 inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, top: 100 }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: -100 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="bg-white rounded-2xl p-10 flex flex-col size-fit"
          >
            <div className="flex gap-2 mb-1">
              <TriangleAlert size={60} className="text-red-600" />
              <div className="text-3xl font-bold self-end">Log out</div>
            </div>

            <div>
              Are you sure you want to log out?
            </div>
            <div className="mt-12 self-end flex gap-4">
              <Button
                className="text-lg bg-white border border-gray-300 text-black hover:bg-red-500 hover:text-white hover:border-red-400 w-[100px]"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
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
