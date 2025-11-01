import { ChannelsList } from "@/components/modules/chat/channels-list";
import { getToken } from "@/server/chat/generate-token";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function ChatPage() {
  const { token, user } = await getToken();
  if (!token || !user) {
    redirect("/");
  }
  
  return (
    <div className="w-full">
      <ChannelsList user={user} token={token} />
    </div>
  );
}
