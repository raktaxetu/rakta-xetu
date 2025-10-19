"use client";
import { useChat } from "ai/react";
import { Chat } from "@/components/ui/chat";

export default function ChatBot() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    status,
    stop,
  } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <Chat
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={isLoading}
      stop={stop}
      append={append}
      suggestions={[
        "How can I prepare donating blood?",
        "What to do after a blood donation?",
        "Who can safely donate blood?",
      ]}
    />
  );
}
