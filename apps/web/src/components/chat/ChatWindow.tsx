import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import type { ChatMessage, Conversation } from "./ChatLayout";

type ChatWindowProps = {
  conversation: Conversation;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
};

export function ChatWindow({
  conversation,
  messages,
  onSendMessage,
}: ChatWindowProps) {
  return (
    <section className="grid h-full min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-white/25">
      <ChatHeader conversation={conversation} />

      <div className="min-h-0 overflow-hidden">
        <MessageList conversation={conversation} messages={messages} />
      </div>

      <MessageInput conversation={conversation} onSendMessage={onSendMessage} />
    </section>
  );
}