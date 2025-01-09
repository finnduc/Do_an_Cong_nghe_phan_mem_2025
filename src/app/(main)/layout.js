import SideBar from "../../components/SideBar";
import TopBar from "../../components/TopBar";

export default function MainLayout({children}){
    return <div className="h-screen flex flex-col bg-[#f5f6fa]">
        <TopBar />
        <div className="grow flex w-full">
            <SideBar />
            {children}
        </div>
    </div>
}