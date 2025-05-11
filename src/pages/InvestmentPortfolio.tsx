
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import InvestmentDashboard from "@/components/investments/InvestmentDashboard";
import InvestmentOpportunities from "@/components/investments/InvestmentOpportunities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";

const InvestmentPortfolio = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchInvestmentData();
    }
  }, [user]);

  const fetchInvestmentData = async () => {
    try {
      setLoading(true);
      // Fetch user's investments
      const { data: userInvestments, error: investmentsError } = await supabase
        .from('user_investments')
        .select(`
          *,
          investment_property:investment_properties(
            *,
            property:properties(*)
          )
        `)
        .eq('user_id', user?.id);
      
      if (investmentsError) throw investmentsError;

      // Fetch investment opportunities (properties available for investment)
      const { data: investmentProps, error: opportunitiesError } = await supabase
        .from('investment_properties')
        .select(`
          *,
          property:properties(*)
        `);
      
      if (opportunitiesError) throw opportunitiesError;
      
      setInvestments(userInvestments || []);
      
      // Filter out properties the user has already invested in
      const investedPropertyIds = userInvestments?.map(inv => inv.investment_property_id) || [];
      const availableOpportunities = investmentProps?.filter(
        prop => !investedPropertyIds.includes(prop.id)
      ) || [];
      
      setOpportunities(availableOpportunities);
    } catch (error: any) {
      toast.error("Failed to load investment data", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Investment Portfolio</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 animate-spin text-naija-primary mr-2" />
            <span>Loading investments...</span>
          </div>
        ) : (
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">My Portfolio</TabsTrigger>
              <TabsTrigger value="opportunities">Investment Opportunities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <InvestmentDashboard investments={investments} onRefresh={fetchInvestmentData} />
            </TabsContent>
            
            <TabsContent value="opportunities">
              <InvestmentOpportunities 
                opportunities={opportunities} 
                onInvestmentMade={fetchInvestmentData} 
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default InvestmentPortfolio;
