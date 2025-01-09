"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export default function TopBarButton() {
  return (
    <div className="flex gap-2 mr-5">
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="border border-blue-500 bg-white text-blue-500 hover:text-white hover:bg-blue-700 w-[90px] p-2 flex items-center justify-center rounded-md"
          >
            <Link href="/login">Login</Link>
          </motion.div>
        </HoverCardTrigger>
        <HoverCardContent className="w-[190px] mt-2 p-3">
          <div className="text-sm w-full">
            Already have an account? <span className="text-blue-600 font-medium">Log in</span> now!
          </div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-blue-500 hover:bg-blue-700 w-[90px] p-2 flex items-center justify-center rounded-md text-white"
          >
            <Link href="/signup">Signup</Link>
          </motion.div>
        </HoverCardTrigger>
        <HoverCardContent className="w-[160px] mt-2 p-3">
          <div className="text-sm w-full">
            <span className="text-blue-600 font-medium">Sign up</span> now to
            start your experience!
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
