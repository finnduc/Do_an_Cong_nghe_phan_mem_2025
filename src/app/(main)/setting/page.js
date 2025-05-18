import SettingUI from "@/components/setting/SettingUI";
import { get_cookie } from "@/lib/cookie/action";

export default async function Page() {
  const { user } = await get_cookie();
  return (
    <SettingUI user={user || {user_id: "", userName: ""}} />
  );
}
