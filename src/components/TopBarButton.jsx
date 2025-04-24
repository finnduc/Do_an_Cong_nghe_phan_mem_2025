"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useEffect, useState } from "react";

export default function TopBarButton() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("user");

    setUserName( userName || "Guest");
  }, []);

  return (
    <div className="flex gap-2 mr-5 items-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
          <motion.img
              src="/images/default-avatar.png" // Default avatar image
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-blue-500"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
            <span className="text-sm font-medium text-gray-700">{userName}</span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-64 bg-white shadow-lg rounded-lg p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/50"
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h4 className="text-lg font-semibold">{userName}</h4>
              <p className="text-sm text-gray-500">User Profile</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600">
              Username: {userName}
            </p>
            <p className="text-sm text-gray-600">
              Email: {userName.toLowerCase()}@example.com
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
