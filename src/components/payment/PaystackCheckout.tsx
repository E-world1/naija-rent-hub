
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaystackCheckoutProps {
  amount: number;
  description: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const PaystackCheckout = ({
  amount,
  description,
  onSuccess,
  onClose
}: PaystackCheckoutProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handlePayment = () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Mock Paystack integration
    // In a real app, this would initialize the Paystack checkout
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-xl">₦{amount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card Payment</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="ussd">USSD</SelectItem>
                <SelectItem value="qr">QR Code</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : `Pay ₦${amount.toLocaleString()}`}
          </Button>
          
          <div className="flex justify-center space-x-4 pt-2">
            <img src="https://res.cloudinary.com/paystack/image/upload/v1653566331/visa-logo_sdgm3l.png" alt="Visa" className="h-6" />
            <img src="https://res.cloudinary.com/paystack/image/upload/v1653566331/mastercard-logo_ktxsnf.png" alt="Mastercard" className="h-6" />
            <img src="https://nigerianbanks.xyz/logo/verve-logo.png" alt="Verve" className="h-6" />
          </div>
          
          <div className="text-center text-xs text-gray-500">
            Secured by <span className="font-medium">Paystack</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaystackCheckout;
