
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ChatMessageProps {
  content: string;
  sentAt: string;
  isOutgoing: boolean;
  senderName: string;
  senderAvatar?: string;
}

const ChatMessage = ({ content, sentAt, isOutgoing, senderName, senderAvatar }: ChatMessageProps) => {
  const initials = senderName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <div className={cn(
      "flex gap-2 mb-4",
      isOutgoing ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="w-8 h-8">
        {senderAvatar && <AvatarImage src={senderAvatar} alt={senderName} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "max-w-[70%] rounded-lg px-4 py-2",
        isOutgoing ? "bg-naija-primary text-white" : "bg-gray-100 text-gray-800"
      )}>
        <div className="text-sm mb-1">{content}</div>
        <div className="text-xs opacity-70">
          {formatDistanceToNow(new Date(sentAt), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
