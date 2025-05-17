import { GetAllUser } from "../../../lib/api/employee";
import { get_cookie } from "@/lib/cookie/action";

export default async function Page() {
  const { user } = await get_cookie();
  console.log(user)
  return (
    <div>
      <h1>Setting</h1>
      <div>Username: {user?.userName}</div>
      <div>Password: ***********</div>
      <Button>Change password</Button>
      
    </div>
  );
}
