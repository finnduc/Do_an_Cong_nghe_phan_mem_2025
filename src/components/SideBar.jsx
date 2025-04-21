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
  "Home": [<House size={20} />, "/"],
  "Employees": [<UserRoundSearch size={20} />, "/employees"],
  "Partners": [<Building2 size={20} />, "/partners"],
  "Parameters": [<ChartBarStacked size={20} />, "/parameters"],
  "Accounts": [<UserRoundPen size={20}/>, "/accounts"],
};

const main = {
  "Stock": [<PackageSearch size={20} />, "/stock"],
  "Exports": [<ArrowRightFromLine size={20} />, "/exports"],
  "Imports": [<Import size={20} />, "/imports"],
  "History": [<History size={20} />, "/history"],
  "AI": [<Bot size={20} />, "/ai"],
}

const other = {
  "Setting": [<Settings size={20} />, "/setting"],
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
