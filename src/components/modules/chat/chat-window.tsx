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
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

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
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
