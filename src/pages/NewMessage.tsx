
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  userType: 'agent' | 'renter';
}

const NewMessage = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from the database
        // For now, we'll use mock data
        const mockUsers: User[] = [
          {
            id: "user1",
            name: "John Doe",
            email: "john@example.com",
            userType: "renter"
          },
          {
            id: "user2",
            name: "Jane Smith",
            email: "jane@example.com",
            userType: "renter"
          },
          {
            id: "user3",
            name: "Michael Johnson",
            email: "michael@example.com",
            userType: "renter"
          },
          {
            id: "user4",
            name: "Lagos Homes",
            email: "info@lagoshomes.com",
            userType: "agent"
          },
          {
            id: "user5",
            name: "Royal Properties",
            email: "contact@royalproperties.ng",
            userType: "agent"
          }
        ];
        
        // Filter out the current user and filter by user type
        // Agents can message renters, renters can message agents
        const filteredUsers = mockUsers.filter(u => 
          u.id !== user?.id && 
          ((userType === 'agent' && u.userType === 'renter') || 
           (userType === 'renter' && u.userType === 'agent'))
        );
        
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user, userType]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startConversation = (recipientId: string, recipientName: string) => {
    // In a real app, this would create a conversation in the database
    // For now, we'll just navigate to a mock conversation
    toast({
      title: "Conversation started",
      description: `You can now chat with ${recipientName}`
    });
    
    // Use a mock conversation ID for now
    navigate("/messages/1");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">New Message</h1>
          
          <div className="mb-6">
            <Input
              placeholder="Search for users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-4">Loading users...</div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <div 
                    key={u.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => startConversation(u.id, u.name)}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
                        <AvatarFallback>{u.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                        <p className="text-xs text-naija-primary capitalize">{u.userType}</p>
                      </div>
                    </div>
                    <Button size="sm">Message</Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No users found matching your search
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
};

export default NewMessage;
