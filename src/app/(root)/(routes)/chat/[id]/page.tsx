import { ChatComponent } from "@/components/modules/chat/chat-window";
import { getToken } from "@/server/chat/generate-token";

export default async function ChatWindow({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const items = await getToken();
  const userId = (await params).id;
  if ("message" in items) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to initialize chat: {items.message}
      </div>
    );
  }
  return <ChatComponent items={items} userId={userId} />;
}
