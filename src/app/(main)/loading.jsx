"use client";

import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function Loading() {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="absolute top-[calc(50%-100px)]"
      >
        <Loader2 className="h-12 w-12 text-blue-500" />
      </motion.div>
    </div>
  );
}
