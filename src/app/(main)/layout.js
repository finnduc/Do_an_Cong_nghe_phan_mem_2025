import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen flex-col bg-[#f5f6fa]">
      <TopBar />
      <div className="flex flex-grow overflow-hidden">
        <SideBar />
        <main className="flex-1 overflow-y-auto pt-10 px-6">
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}