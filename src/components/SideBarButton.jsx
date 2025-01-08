"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const textMotion = {
  rest: {
    color: "black",
    x: 0,
  },
  hover: {
    color: "white",
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

export default function SideBarButton({ title, icon, route }) {
  const pathName = usePathname()
  const isActive = route === pathName
  return (
    <Link href={route}>
      <motion.div
        initial="rest"
        whileHover="hover"
        animate= {isActive ? "hover": "rest"}
        className="w-full h-[43px] flex text-sm group"
      >
        <motion.div
          variants={slashMotion}
          className="flex w-[20px] h-full rounded-r-md bg-blue"
        >
          <div className="w-[10px] bg-blue-500 rounded-r-md" />
        </motion.div>
        <motion.div
          variants={textMotion}
          className="h-full w-full mr-6 rounded-md flex items-center gap-x-3 px-4 group-hover:bg-blue-500"
        >
          {icon}
          {title}
        </motion.div>
      </motion.div>
    </Link>
  );
}
