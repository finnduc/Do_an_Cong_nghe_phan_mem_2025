import TopBarButton from "./TopBarButton";

export default function TopBar() {
  return (
    <div className="top-0 left-0 w-screen min-h-[60px] bg-white text-black flex justify-between px-8 items-center border-b">
      <div className="text-2xl font-extrabold uppercase">
        <span className="text-blue-600">Stock</span><span>ly</span>
      </div>
      <TopBarButton />
    </div>
  );
}