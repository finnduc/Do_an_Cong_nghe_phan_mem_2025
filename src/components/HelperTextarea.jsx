"use client";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import { motion } from "motion/react";

export default function HelperTextarea() {
  const updateHeight = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
  };
  return (
    <div className="w-full h-[300px] bg-white rounded-lg flex flex-col p-5 border border-input">
      <div className="border border-input rounded-md shadow-sm flex px-3 py-2">
        <Textarea
          className="resize-none overflow-hidden border-0 shadow-none focus-visible:ring-0 px-0 py-0"
          placeholder="Nhập yêu cầu của bạn."
          onChange={updateHeight}
        />
        <motion.div
          whileHover={{ backgroundColor: '#3b82f6', scale: 1.1, color: 'white'}}
          whileTap={{ backgroundColor: '#3b82f6', scale: 0.8, color: 'white'}}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
        }}
          className="size-fit p-2 rounded-[50%]"
        >
          <SendHorizonal strokeWidth={1.5} />
        </motion.div>
      </div>
    </div>
  );
}
