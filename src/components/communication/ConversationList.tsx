
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const ConversationList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from the database
        // For now, we'll use mock data
        const mockData: Conversation[] = [
          {
            id: "1",
            participant: {
              id: "user1",
              name: "John Doe",
            },
            lastMessage: "Hello, I'm interested in the property at Lekki",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),  // 5 mins ago
            unreadCount: 2
          },
          {
            id: "2",
            participant: {
              id: "user2",
              name: "Jane Smith",
            },
            lastMessage: "When can I view the apartment?",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            unreadCount: 0
          },
          {
            id: "3",
            participant: {
              id: "user3",
              name: "Michael Johnson",
            },
            lastMessage: "Is the property still available?",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            unreadCount: 1
          }
        ];
        
        setConversations(mockData);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  const createNewConversation = () => {
    navigate("/messages/new");
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading conversations...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>
        <Button onClick={createNewConversation}>
          New Message
        </Button>
      </div>

      <ScrollArea className="flex-grow">
        {conversations.length > 0 ? (
          <div className="divide-y">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/messages/${conversation.id}`}
                className="flex items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <Avatar className="h-10 w-10 mr-3">
                  {conversation.participant.avatar && (
                    <AvatarImage
                      src={conversation.participant.avatar}
                      alt={conversation.participant.name}
                    />
                  )}
                  <AvatarFallback>
                    {conversation.participant.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">
                      {conversation.participant.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(conversation.lastMessageTime), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>

                {conversation.unreadCount > 0 && (
                  <div className="ml-2 bg-naija-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-center">No conversations yet</p>
            <Button onClick={createNewConversation} className="mt-4">
              Start a conversation
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
