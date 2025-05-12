
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChartContainer, 
  ChartTooltip
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Loader, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InvestmentDashboardProps {
  investments: any[];
  onRefresh: () => void;
}

const InvestmentDashboard = ({ investments, onRefresh }: InvestmentDashboardProps) => {
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [totalGains, setTotalGains] = useState<number>(0);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [isSelling, setIsSelling] = useState<boolean>(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [showSellDialog, setShowSellDialog] = useState<boolean>(false);

  useEffect(() => {
    calculatePortfolioMetrics();
    if (investments.length > 0) {
      fetchHistoricalData();
    }
  }, [investments]);

  const calculatePortfolioMetrics = () => {
    let currentValue = 0;
    let initialValue = 0;

    investments.forEach(investment => {
      const currentPropertyValue = investment.investment_property?.current_value || 0;
      const investmentPercentage = investment.shares;
      
      // Calculate the portion of the property's value that belongs to this investment
      const investmentCurrentValue = currentPropertyValue * investmentPercentage;
      currentValue += investmentCurrentValue;
      
      // Calculate original investment
      initialValue += investment.investment_amount;
    });

    setPortfolioValue(currentValue);
    setTotalGains(currentValue - initialValue);
  };

  const fetchHistoricalData = async () => {
    try {
      setLoadingHistory(true);
      // Get all investment property IDs
      const propertyIds = investments.map(inv => inv.investment_property_id);
      
      // Fetch the historical value data for these properties
      const { data, error } = await supabase
        .from('property_value_history')
        .select('*')
        .in('investment_property_id', propertyIds)
        .order('value_date', { ascending: true });
        
      if (error) throw error;
      
      // Process the historical data to create chart data
      // Group by month and sum values
      const processedData = processHistoricalData(data || [], investments);
      setPerformanceData(processedData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const processHistoricalData = (historyData: any[], userInvestments: any[]) => {
    // Create a map of investments by property ID for easy lookup
    const investmentsByProperty = new Map();
    userInvestments.forEach(inv => {
      investmentsByProperty.set(inv.investment_property_id, inv);
    });

    // Process each history record
    const dataByMonth: Record<string, { date: string, value: number }> = {};
    
    historyData.forEach(record => {
      // Get the investment for this property
      const investment = investmentsByProperty.get(record.investment_property_id);
      if (!investment) return;
      
      // Calculate the invested portion
      const value = record.property_value * investment.shares;
      
      // Format date to YYYY-MM
      const date = new Date(record.value_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = { date: monthKey, value: 0 };
      }
      
      // Accumulate value for this month
      dataByMonth[monthKey].value += value;
    });
    
    // Convert to array and sort by date
    return Object.values(dataByMonth).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate ROI as percentage
  const calculateROI = (investment: any) => {
    const initial = investment.investment_amount;
    const current = investment.investment_property?.current_value * investment.shares;
    if (initial === 0) return 0;
    return ((current - initial) / initial) * 100;
  };

  // Handle selling an investment
  const handleSellInvestment = async () => {
    if (!selectedInvestment) return;
    
    try {
      setIsSelling(true);
      
      // Calculate current value of the investment
      const currentValue = selectedInvestment.investment_property.current_value * selectedInvestment.shares;
      
      // Delete the investment
      const { error } = await supabase
        .from('user_investments')
        .delete()
        .eq('id', selectedInvestment.id);
      
      if (error) throw error;
      
      // Show success message with the sold amount
      toast.success("Investment sold successfully!", {
        description: `You've sold your investment for ${formatCurrency(currentValue)}`
      });
      
      // Refresh the investment data
      onRefresh();
    } catch (error: any) {
      toast.error("Failed to sell investment", {
        description: error.message
      });
    } finally {
      setIsSelling(false);
      setShowSellDialog(false);
      setSelectedInvestment(null);
    }
  };

  const openSellDialog = (investment: any) => {
    setSelectedInvestment(investment);
    setShowSellDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-naija-primary">
              {formatCurrency(portfolioValue)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Gains/Losses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGains >= 0 ? '+' : ''}{formatCurrency(totalGains)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Number of Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {investments.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Performance Chart */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="h-80 flex justify-center items-center">
              <Loader className="animate-spin h-8 w-8 text-naija-primary" />
            </div>
          ) : performanceData.length > 0 ? (
            <div className="h-80">
              <ChartContainer
                config={{
                  value: {
                    theme: {
                      light: "#16A34A", // Green for positive values
                      dark: "#16A34A"
                    }
                  }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const [year, month] = value.split('-');
                        return `${month}/${year.substring(2)}`;
                      }}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip 
                      content={(props) => {
                        if (!props.active || !props.payload || props.payload.length === 0) {
                          return null;
                        }
                        const data = props.payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="text-gray-600">{`Date: ${props.label}`}</p>
                            <p className="font-medium">{`Value: ${formatCurrency(data.value)}`}</p>
                          </div>
                        );
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Value" 
                      stroke="#16A34A" 
                      strokeWidth={2}
                      dot={true}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          ) : (
            <div className="h-80 flex justify-center items-center text-gray-500">
              Not enough historical data to display performance chart
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Details */}
      {investments.length > 0 ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">My Investments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investments.map(investment => (
              <Card key={investment.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={investment.investment_property?.property?.image || "https://placehold.co/600x400?text=Property"} 
                    alt={investment.investment_property?.property?.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-lg mb-1">{investment.investment_property?.property?.title}</h4>
                  <p className="text-gray-500 text-sm mb-3">{investment.investment_property?.property?.location}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Initial Investment</p>
                      <p className="font-medium">{formatCurrency(investment.investment_amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Current Value</p>
                      <p className="font-medium">
                        {formatCurrency(investment.investment_property?.current_value * investment.shares)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ROI</p>
                      <p className={`font-medium ${calculateROI(investment) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculateROI(investment).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Invested</p>
                      <p className="font-medium">
                        {formatDistanceToNow(new Date(investment.investment_date), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <Badge variant={investment.investment_property.appreciation_model === 'fixed' ? 'outline' : 'secondary'}>
                      {investment.investment_property.appreciation_model === 'fixed' 
                        ? `${investment.investment_property.appreciation_rate}% fixed appreciation` 
                        : 'Manual appreciation'}
                    </Badge>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => openSellDialog(investment)}
                    >
                      Sell Investment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">No Investments Yet</h3>
          <p className="text-gray-500">
            Start investing in properties to build your portfolio. Check out the available opportunities.
          </p>
        </div>
      )}
      
      {/* Sell Investment Confirmation Dialog */}
      <AlertDialog open={showSellDialog} onOpenChange={setShowSellDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sell Investment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sell your investment in{" "}
              <span className="font-semibold">
                {selectedInvestment?.investment_property?.property?.title || "this property"}
              </span>?
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Initial Investment</p>
                    <p className="font-medium">
                      {selectedInvestment && formatCurrency(selectedInvestment.investment_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Value</p>
                    <p className="font-medium text-green-600">
                      {selectedInvestment && formatCurrency(selectedInvestment.investment_property?.current_value * selectedInvestment.shares)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Profit/Loss</p>
                    <p className={`font-medium ${selectedInvestment && (selectedInvestment.investment_property?.current_value * selectedInvestment.shares - selectedInvestment.investment_amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedInvestment && formatCurrency(selectedInvestment.investment_property?.current_value * selectedInvestment.shares - selectedInvestment.investment_amount)}
                    </p>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleSellInvestment}
              disabled={isSelling}
            >
              {isSelling ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Selling...
                </>
              ) : (
                'Sell Investment'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvestmentDashboard;
