"use client";
import { useState, useEffect } from "react";
import type { Channel as StreamChannel } from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
  OPTIONAL_MESSAGE_ACTIONS,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import type { CustomMessageActions } from "stream-chat-react";

interface TokenItem {
  token: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

type Props = {
  items: TokenItem;
  userId: string;
};

export function ChatComponent({ items, userId }: Props) {
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    tokenOrProvider: items.token,
    userData: items.user,
  });

  useEffect(() => {
    if (!client || !items.user?.id) return;

    const createChannel = async () => {
      const newChannel = client.channel("messaging", {
        members: [items.user.id, userId],
      });
      await newChannel.watch();
      setChannel(newChannel);
    };
    createChannel();
  }, [client, items.user?.id, userId]);

  const customMessageActions: CustomMessageActions = {
    "Delete for Me": async (message) => {
      if (!client) return;
      try {
        await client.deleteMessage(message.id, { deleteForMe: true });
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    },
  };

  if (!client || !channel) {
    return (
      <div className="p-4 w-full flex justify-center items-center">
        <p className="py-1 px-2 bg-amber-400 border text-white border-amber-600 rounded w-fit text-sm font-light">
          Initializing Chat..
        </p>
      </div>
    );
  }

  return (
    <Chat client={client}>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList
            messageActions={[
              "quote",
              "edit",
              "delete",
              "react",
              OPTIONAL_MESSAGE_ACTIONS.deleteForMe,
            ]}
            customMessageActions={customMessageActions}
          />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
}
