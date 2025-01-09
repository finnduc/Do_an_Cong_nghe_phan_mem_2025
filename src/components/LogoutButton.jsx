"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const textMotion = {
  rest: {
    color: "black",
    x: 0,
  },
  hover: {
    color: "white",
    backgroundColor: "#3b82f6",
    x: 10,
  },
};

const slashMotion = {
  rest: { opacity: 0, ease: "easeOut", duration: 0.2, type: "tween", x: -10 },
  hover: {
    opacity: 1,
    x: -1,
  },
};

export default function LogoutButton({ icon, title }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="w-full h-[43px] flex text-sm group"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <motion.div
          variants={slashMotion}
          className="flex w-[7px] h-full rounded-r-md bg-blue-500"
        ></motion.div>
        <motion.div
          variants={textMotion}
          className="h-full w-full mr-6 rounded-md flex items-center gap-x-3 px-4"
        >
          {icon}
          {title}
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 z-10 bg-black/25"
              onClick={() => setIsOpen(false)}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, top: 100 }}
              animate={{ opacity: 1, top: "50%" }}
              exit={{ opacity: 0, top: -100}}
              transition={{ ease: "easeOut", duration: 0.3 }}
              className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="bg-white rounded-2xl p-10 flex flex-col">
                <div className="flex gap-2 mb-1">
                  <TriangleAlert size={60} className="text-red-600" />
                  <div className="text-3xl font-bold self-end">Log out</div>
                </div>

                <div>
                  Bạn có chắc chắn rằng bạn muốn đăng xuất khỏi tài khoản không?
                </div>
                <div className="mt-12 self-end flex gap-4">
                  <Button
                    asChild
                    className="text-lg bg-white border border-gray-300 text-black hover:bg-red-500 hover:text-white hover:border-red-400 w-[100px]"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={"/"}>Logout</Link>
                  </Button>
                  <Button
                    className="text-lg bg-blue-500 hover:bg-blue-700 w-[100px]"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
