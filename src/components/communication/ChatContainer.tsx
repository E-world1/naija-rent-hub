
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import CallButton from "./CallButton";
import { useAuth } from "@/context/AuthContext";
import { playSound } from "@/utils/soundEffects";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  sentAt: string;
}

const ChatContainer = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipient, setRecipient] = useState({ id: "", name: "" });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from the database
        // For now, we'll use mock data
        const mockRecipient = { id: "user1", name: "John Doe" };
        setRecipient(mockRecipient);
        
        const mockMessages: Message[] = [
          {
            id: "1",
            content: "Hello, I'm interested in the 3 bedroom apartment in Lekki Phase 1",
            senderId: "user1",
            senderName: "John Doe",
            sentAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
          },
          {
            id: "2",
            content: "Hi John, thank you for your interest. When would you like to view the property?",
            senderId: user?.id || "",
            senderName: "Agent",
            sentAt: new Date(Date.now() - 1000 * 60 * 55).toISOString() // 55 mins ago
          },
          {
            id: "3",
            content: "Can I come tomorrow around 2pm?",
            senderId: "user1",
            senderName: "John Doe",
            sentAt: new Date(Date.now() - 1000 * 60 * 50).toISOString() // 50 mins ago
          },
          {
            id: "4",
            content: "Yes, that works for me. I'll send you the address details",
            senderId: user?.id || "",
            senderName: "Agent",
            sentAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
          },
          {
            id: "5",
            content: "The property is located at 123 Admiralty Way, Lekki Phase 1. Call me when you arrive.",
            senderId: user?.id || "",
            senderName: "Agent",
            sentAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() // 40 mins ago
          }
        ];
        
        setMessages(mockMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId && user) {
      fetchMessages();
    }
  }, [conversationId, user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!user) return;
    
    setSending(true);
    try {
      // Play message sound effect
      playSound('message');
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        senderId: user.id,
        senderName: "You",
        sentAt: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, newMessage]);
      
      // In a real app, this would send to the database
      // For now, we simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-semibold">{recipient.name}</h3>
        <CallButton recipientName={recipient.name} recipientId={recipient.id} />
      </div>
      
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sentAt={message.sentAt}
              isOutgoing={message.senderId === user?.id}
              senderName={message.senderName}
              senderAvatar={message.senderAvatar}
            />
          ))}
        </div>
      </ScrollArea>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={sending} />
    </div>
  );
};

export default ChatContainer;
