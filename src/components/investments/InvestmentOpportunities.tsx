
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface InvestmentOpportunitiesProps {
  opportunities: any[];
  onInvestmentMade: () => void;
}

const investmentSchema = z.object({
  amount: z
    .string()
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Investment amount must be greater than 0",
    }),
});

const InvestmentOpportunities = ({ opportunities, onInvestmentMade }: InvestmentOpportunitiesProps) => {
  const { user } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isInvesting, setIsInvesting] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      amount: "",
    },
  });

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleInvestClick = (property: any) => {
    setSelectedProperty(property);
    form.setValue("amount", "");
    setIsDialogOpen(true);
  };

  const handleInvest = async (data: z.infer<typeof investmentSchema>) => {
    if (!user || !selectedProperty) return;

    try {
      setIsInvesting(true);
      const amount = Number(data.amount);
      
      // Calculate shares (portion of ownership)
      const shares = amount / selectedProperty.current_value;
      
      // Create the investment
      const { data: investmentData, error } = await supabase
        .from('user_investments')
        .insert([
          {
            user_id: user.id,
            investment_property_id: selectedProperty.id,
            investment_amount: amount,
            shares: shares,
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast.success("Investment successful!", {
        description: `You've invested ${formatCurrency(amount)} in ${selectedProperty.property.title}`
      });
      
      setIsDialogOpen(false);
      onInvestmentMade();
    } catch (error: any) {
      toast.error("Investment failed", {
        description: error.message
      });
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Investment Opportunities</h2>
        <p className="text-gray-500">Discover properties available for investment</p>
      </div>
      
      {opportunities.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">No Investment Opportunities</h3>
          <p className="text-gray-500">
            Check back later for new investment opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={opportunity.property?.image || "https://placehold.co/600x400?text=Property"} 
                  alt={opportunity.property?.title} 
                  className="w-full h-full object-cover"
                />
                {opportunity.appreciation_model === 'fixed' && (
                  <Badge className="absolute top-2 right-2 bg-naija-secondary text-black">
                    {opportunity.appreciation_rate}% Growth Rate
                  </Badge>
                )}
                <Badge className="absolute top-2 left-2 bg-white text-naija-primary">
                  {opportunity.property?.type || 'Investment Property'}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{opportunity.property?.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{opportunity.property?.location}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Current Value</p>
                    <p className="text-lg font-bold text-naija-dark">{formatCurrency(opportunity.current_value)}</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">
                      {opportunity.appreciation_model === 'fixed' 
                        ? `${opportunity.appreciation_rate}% quarterly` 
                        : 'Market-based'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-naija-primary hover:bg-naija-primary/90"
                  onClick={() => handleInvestClick(opportunity)}
                >
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Investment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in Property</DialogTitle>
            <DialogDescription>
              {selectedProperty?.property?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Current Property Value</p>
                <p className="font-medium">{selectedProperty && formatCurrency(selectedProperty.current_value)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Appreciation Model</p>
                <p className="font-medium capitalize">{selectedProperty?.appreciation_model}</p>
                {selectedProperty?.appreciation_model === 'fixed' && (
                  <p className="text-xs text-green-600">{selectedProperty.appreciation_rate}% rate</p>
                )}
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleInvest)}>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Amount (₦)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter amount" 
                          {...field}
                          type="number"
                          min="0"
                          step="1000"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the amount you wish to invest in this property
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    className="bg-naija-primary hover:bg-naija-primary/90"
                    disabled={isInvesting}
                  >
                    {isInvesting ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Processing
                      </>
                    ) : (
                      'Confirm Investment'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentOpportunities;
