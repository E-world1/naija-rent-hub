
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader, Home, MapPin, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Agent {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  propertyCount: number;
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        
        // Get all profiles with user_type = 'agent'
        const { data: agentProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'agent');
        
        if (profilesError) throw profilesError;
        
        // Get the count of properties for each agent
        const agentsWithProperties = await Promise.all(
          (agentProfiles || []).map(async (agent) => {
            const { count, error: countError } = await supabase
              .from('properties')
              .select('id', { count: 'exact', head: true })
              .eq('agent_id', agent.id);
            
            if (countError) console.error("Error getting property count:", countError);
            
            return {
              ...agent,
              propertyCount: count || 0
            };
          })
        );
        
        setAgents(agentsWithProperties);
      } catch (error: any) {
        console.error("Error fetching agents:", error);
        setError(error.message);
        toast.error("Error loading agents", {
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgents();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Agents</h1>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Agents</TabsTrigger>
            <TabsTrigger value="top">Top Agents</TabsTrigger>
            <TabsTrigger value="new">New Agents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="pt-4">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="h-8 w-8 animate-spin text-naija-primary" />
                <span className="ml-2">Loading agents...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 rounded-lg">
                <h3 className="text-xl font-medium mb-2 text-red-700">Error Loading Agents</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-naija-primary hover:bg-naija-primary/90"
                >
                  Try Again
                </Button>
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium mb-2">No agents found</h3>
                <p className="text-gray-600">There are currently no registered agents.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent) => (
                  <Card key={agent.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <Avatar className="h-24 w-24 mb-4">
                          {agent.avatar_url ? (
                            <img 
                              src={agent.avatar_url} 
                              alt={`${agent.first_name} ${agent.last_name}`} 
                            />
                          ) : (
                            <div className="bg-naija-primary text-white h-full w-full flex items-center justify-center text-2xl">
                              {agent.first_name?.[0]}{agent.last_name?.[0]}
                            </div>
                          )}
                        </Avatar>
                        <h3 className="text-xl font-semibold">
                          {agent.first_name} {agent.last_name}
                        </h3>
                        <div className="flex items-center justify-center mt-1">
                          <Badge className="bg-naija-primary">Agent</Badge>
                          {agent.propertyCount > 0 && (
                            <Badge variant="outline" className="ml-2">
                              {agent.propertyCount} {agent.propertyCount === 1 ? 'Property' : 'Properties'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {agent.phone && (
                        <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                          <Phone className="h-3.5 w-3.5 mr-1.5" />
                          <span>{agent.phone}</span>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-center">
                        <Button asChild className="bg-naija-primary hover:bg-naija-primary/90">
                          <a href={`/agent/${agent.id}`}>View Profile</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="top" className="pt-4">
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-2">Top Agents</h3>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="new" className="pt-4">
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-2">New Agents</h3>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Agents;
