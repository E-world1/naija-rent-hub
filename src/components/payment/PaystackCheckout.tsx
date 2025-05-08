
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Shield, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaystackCheckoutProps {
  amount: number;
  description: string;
  onSuccess?: () => void;
  onClose?: () => void;
  isEscrow?: boolean;
}

type PaymentStatus = 'pending' | 'completed' | 'disputed' | 'released';

const PaystackCheckout = ({
  amount,
  description,
  onSuccess,
  onClose,
  isEscrow = true
}: PaystackCheckoutProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [enableEscrow, setEnableEscrow] = useState(isEscrow);
  const [dispute, setDispute] = useState({
    active: false,
    reason: "",
  });

  // Platform fee calculation (5% commission)
  const platformFee = amount * 0.05;
  const landlordAmount = amount - platformFee;

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
      setPaymentStatus("completed");
      
      toast({
        title: enableEscrow ? "Payment Held in Escrow" : "Payment Successful",
        description: enableEscrow 
          ? "Your payment is being held securely until you confirm property satisfaction." 
          : "Your payment has been processed successfully.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }, 2000);
  };

  const handleReleasePayment = () => {
    setIsLoading(true);
    
    // Mock payment release process
    setTimeout(() => {
      setIsLoading(false);
      setPaymentStatus("released");
      
      toast({
        title: "Payment Released",
        description: `₦${landlordAmount.toLocaleString()} has been released to the landlord/agent.`,
      });
    }, 1500);
  };

  const handleDisputePayment = () => {
    if (!dispute.reason) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for the dispute.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Mock dispute process
    setTimeout(() => {
      setIsLoading(false);
      setPaymentStatus("disputed");
      setDispute({ ...dispute, active: true });
      
      toast({
        title: "Dispute Filed",
        description: "Your dispute has been recorded. Our team will contact you soon.",
        variant: "destructive",
      });
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      {paymentStatus === "pending" && (
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-xl">₦{amount.toLocaleString()}</span>
              </div>
              
              {enableEscrow && (
                <div className="mt-2 pt-2 border-t border-dashed border-gray-300">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Platform Fee (5%):</span>
                    <span className="font-medium">₦{platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Landlord/Agent Receives:</span>
                    <span className="font-medium">₦{landlordAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}
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
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="escrow-mode" 
                checked={enableEscrow} 
                onCheckedChange={setEnableEscrow}
              />
              <Label htmlFor="escrow-mode" className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-600" />
                Enable Escrow Protection
              </Label>
            </div>
            
            {enableEscrow && (
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-blue-600" />
                <p>
                  Your payment will be held securely until you confirm satisfaction with the property. 
                  You'll have 72 hours after moving in to report any issues.
                </p>
              </div>
            )}
            
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
      )}
      
      {(paymentStatus === "completed" || paymentStatus === "disputed" || paymentStatus === "released") && (
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Amount:</span>
                <span className="font-bold text-xl">₦{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-600">Status:</span>
                <div className="flex items-center">
                  {paymentStatus === "completed" && (
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      In Escrow
                    </span>
                  )}
                  {paymentStatus === "disputed" && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Disputed
                    </span>
                  )}
                  {paymentStatus === "released" && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Released
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-dashed border-gray-300">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Platform Fee (5%):</span>
                  <span className="font-medium">₦{platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Landlord/Agent Receives:</span>
                  <span className="font-medium">₦{landlordAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {paymentStatus === "completed" && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                  <p className="font-medium mb-1">Your payment is being held in escrow</p>
                  <p>
                    After inspecting the property, please release the payment if you're satisfied, 
                    or submit a dispute if there are any issues.
                  </p>
                </div>
                
                <Tabs defaultValue="release">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="release">Release Payment</TabsTrigger>
                    <TabsTrigger value="dispute">File a Dispute</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="release" className="pt-2">
                    <div className="text-center space-y-4">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                      <div>
                        <p className="font-medium">Ready to release payment?</p>
                        <p className="text-sm text-gray-600 mb-4">
                          Confirm that you're satisfied with the property and release the payment to the landlord/agent.
                        </p>
                      </div>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleReleasePayment}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Release Payment"}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dispute" className="pt-2">
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">File a dispute</p>
                        <p className="text-sm text-gray-600 mb-2">
                          If there are issues with the property, please provide details below.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dispute-reason">Reason for dispute</Label>
                        <textarea
                          id="dispute-reason"
                          className="w-full min-h-[100px] border border-gray-300 rounded-md p-2"
                          placeholder="Please describe the issue in detail..."
                          value={dispute.reason}
                          onChange={(e) => setDispute({ ...dispute, reason: e.target.value })}
                          required
                        />
                      </div>
                      
                      <Button 
                        variant="destructive"
                        className="w-full"
                        onClick={handleDisputePayment}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Submit Dispute"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {paymentStatus === "disputed" && (
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-md text-sm text-red-800">
                  <p className="font-medium mb-1">Your dispute has been received</p>
                  <p>
                    Our team will review your dispute within 1-2 business days. 
                    The payment will remain on hold until the review is complete.
                  </p>
                  <div className="mt-2 pt-2 border-t border-dashed border-red-200">
                    <p className="font-medium">Dispute reason:</p>
                    <p className="mt-1 text-gray-800">{dispute.reason}</p>
                  </div>
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  <p>Reference ID: ES{Math.floor(Math.random() * 1000000)}</p>
                  <p className="mt-1">Need help? Contact our support team.</p>
                </div>
              </div>
            )}
            
            {paymentStatus === "released" && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md text-sm text-green-800">
                  <p className="font-medium mb-1">Payment has been released</p>
                  <p>
                    The landlord/agent has received their payment. Thank you for using our escrow service.
                  </p>
                  <div className="mt-2 pt-2 border-t border-dashed border-green-200">
                    <div className="flex justify-between items-center">
                      <span>Transaction ID:</span>
                      <span className="font-mono">TS{Math.floor(Math.random() * 1000000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-center border-t pt-4 text-xs text-gray-500">
        <p>Protected by NaijaRentHub Secure Payments</p>
      </CardFooter>
    </Card>
  );
};

export default PaystackCheckout;
