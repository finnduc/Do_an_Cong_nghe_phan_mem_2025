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
  History
} from "lucide-react";

const main = {
  "Trang chủ": [<House size={20} />, '/'],
  "Nhân viên": [<UserRoundSearch size={20} />, '/employees'],
  "Đối tác": [<Building2 size={20} />, '/partners'],
  "Tồn kho": [<PackageSearch size={20} />, '/stock'],
};

const transaction = {
  "Xuất kho": [<ArrowRightFromLine size={20} />, '/exports'],
  "Nhập kho": [<Import size={20} />, '/imports'],
  "Lịch sử": [<History size={20}/>, '/history']
};

const helper = {
  AI: [<Bot size={20} />, '/helper']
};

const other = {
  "Cài đặt": [<Settings size={20} />, '/setting'],
  "Đăng xuất": [<LogOut size={20} />, '/logout']
};

export default function SideBar() {
  return (
    <div className="min-w-[225px] pt-3 h-full bg-white text-black flex flex-col gap-6 divide-y-[1px]">
      <div className="flex flex-col gap-2">
            {Object.entries(main).map(([title, other], id) => (
                <SideBarButton key={id} title={title} icon={other[0]} route={other[1]} />
            ))}
      </div>
      <div>
        <div className="px-9 mb-4 mt-2 text-sm text-gray-500 font-medium uppercase">
          Giao dịch
        </div>
        <div className="flex flex-col gap-2">
          {Object.entries(transaction).map(([title, other], id) => (
            <SideBarButton key={id} title={title} icon={other[0]} route={other[1]} />
          ))}
        </div>
      </div>
      <div>
        <div className="px-9 mb-4 mt-2 text-sm text-gray-500 font-medium uppercase">
          Hỗ trợ
        </div>
        <div className="flex flex-col gap-2">
          {Object.entries(helper).map(([title, other], id) => (
            <SideBarButton key={id} title={title} icon={other[0]} route={other[1]} />
          ))}
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-2 mt-4">
          {Object.entries(other).map(([title, other], id) => (
            <SideBarButton key={id} title={title} icon={other[0]} route={other[1]} />
          ))}
        </div>
      </div>
    </div>
  );
}
