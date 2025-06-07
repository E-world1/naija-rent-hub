
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, User, Building, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Agent } from "@/types/agent";

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        
        // Fetch agents with property count
        const { data: agentsData, error: agentsError } = await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            phone,
            avatar_url,
            user_type,
            created_at,
            updated_at
          `)
          .eq('user_type', 'agent');

        if (agentsError) throw agentsError;

        // Get property counts for each agent
        const agentsWithCounts = await Promise.all(
          (agentsData || []).map(async (agent) => {
            const { count } = await supabase
              .from('properties')
              .select('*', { count: 'exact', head: true })
              .eq('agent_id', agent.id)
              .eq('status', 'active');

            return {
              ...agent,
              propertyCount: count || 0
            };
          })
        );

        setAgents(agentsWithCounts);
      } catch (error: any) {
        console.error("Error fetching agents:", error);
        toast.error("Error loading agents", {
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleContactAgent = (agentId: string) => {
    // In a real app, this would open a contact modal or redirect to a contact form
    toast.success("Contact request sent!", {
      description: "The agent will get back to you soon."
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-naija-primary mr-2" />
          <span>Loading agents...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-naija-accent py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Our Trusted Agents</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Connect with experienced real estate professionals who will help you find your perfect property or sell your current one.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {agents.length === 0 ? (
          <div className="text-center py-16">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No agents found</h3>
            <p className="text-gray-500">No agents are currently registered on the platform.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <Card key={agent.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                      {agent.avatar_url ? (
                        <img 
                          src={agent.avatar_url} 
                          alt={`${agent.first_name} ${agent.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">
                      {agent.first_name || agent.last_name 
                        ? `${agent.first_name || ''} ${agent.last_name || ''}`.trim()
                        : 'Agent'
                      }
                    </h3>
                    
                    <Badge className="bg-naija-primary text-white mb-4">
                      Real Estate Agent
                    </Badge>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{agent.propertyCount} Properties Listed</span>
                    </div>
                    
                    {agent.phone && (
                      <div className="flex items-center text-gray-600 mb-4">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{agent.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2 w-full">
                      <Button 
                        className="flex-1 bg-naija-primary hover:bg-naija-primary/90"
                        onClick={() => handleContactAgent(agent.id)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          // In a real app, this would show agent's properties
                          toast.info("Feature coming soon", {
                            description: "View agent properties feature will be available soon."
                          });
                        }}
                      >
                        View Properties
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Agents;
