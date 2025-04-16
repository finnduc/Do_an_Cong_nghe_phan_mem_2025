"use client";


import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen flex-col bg-[#f5f6fa]">
      <Topbar />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
