import { ChannelsList } from "@/components/modules/chat/channels-list";
import { UsersList } from "@/components/modules/chat/users-list";
import { getToken } from "@/server/chat/generate-token";
import { listUsers } from "@/server/user/user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function ChatPage() {
  const users = await listUsers();
  const { token, user } = await getToken();
  if (!token || !user) {
    redirect("/");
  }
  return (
    <div className="w-full">
      <UsersList users={users} />
      <ChannelsList user={user} token={token} />
    </div>
  );
}
