import LogoutButton from "./LogoutButton";
import SideBarButton from "./SideBarButton";
import {
  House,
  UserRoundSearch,
  Building2,
  PackageSearch,
  ArrowRightFromLine,
  Import,
  Bot,
  Settings,
  LogOut,
  History,
  ChartBarStacked,
  UserRoundPen
} from "lucide-react";

const management = {
  "Trang chủ": [<House size={20} />, "/"],
  "Nhân viên": [<UserRoundSearch size={20} />, "/employees"],
  "Đối tác": [<Building2 size={20} />, "/partners"],
  "Danh mục": [<ChartBarStacked size={20} />, "/categories"],
  "Tài khoản": [<UserRoundPen size={20}/>, "/accounts"],
};

const main = {
  "Tồn kho": [<PackageSearch size={20} />, "/stock"],
  "Xuất kho": [<ArrowRightFromLine size={20} />, "/exports"],
  "Nhập kho": [<Import size={20} />, "/imports"],
  "Lịch sử": [<History size={20} />, "/history"],
  "AI": [<Bot size={20} />, "/ai"],
}

const other = {
  "Cài đặt": [<Settings size={20} />, "/setting"],
};

const logout = ["Logout", <LogOut size={20} />];

export default function SideBar() {
  return (
    <div className="min-w-[225px] pt-3 h-full bg-white text-black flex flex-col gap-5 divide-y-[1px]">
      <div className="flex flex-col gap-2">
        {Object.entries(management).map(([title, other], id) => (
          <SideBarButton
            key={id}
            title={title}
            icon={other[0]}
            route={other[1]}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 pt-4">
        {Object.entries(main).map(([title, other], id) => (
          <SideBarButton
            key={id}
            title={title}
            icon={other[0]}
            route={other[1]}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 pt-4">
        {Object.entries(other).map(([title, other], id) => (
          <SideBarButton
            key={id}
            title={title}
            icon={other[0]}
            route={other[1]}
          />
        ))}
        <LogoutButton title={logout[0]} icon={logout[1]} />
      </div>
    </div>
  );
}
