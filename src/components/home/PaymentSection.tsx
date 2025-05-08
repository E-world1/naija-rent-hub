
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";

const PaymentSection = () => {
  const [activeTab, setActiveTab] = useState("secure");
  
  return (
    <section className="py-16 bg-naija-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 text-naija-dark">Secure Payments & Escrow Protection</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Our innovative payment system protects both tenants and landlords through secure escrow services, 
            automated split payments, and simple dispute resolution.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="secure">Secure Payments</TabsTrigger>
            <TabsTrigger value="escrow">Escrow Protection</TabsTrigger>
            <TabsTrigger value="dispute">Dispute Resolution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="secure" className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-naija-dark">Secure Payments with Paystack</h3>
                </div>
                <p className="mb-6 text-gray-600">
                  We've integrated with Paystack to ensure your rental payments are secure, 
                  transparent, and hassle-free. Our platform automatically splits payments, 
                  taking our small commission while ensuring landlords receive their funds quickly.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    <span>Secure transactions with bank-level encryption</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    <span>Multiple payment options including cards, bank transfers, and USSD</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    <span>Automatic 5% platform fee with transparent breakdown</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    <span>Instant payment confirmations and receipts</span>
                  </li>
                </ul>
                <Button className="bg-naija-primary hover:bg-naija-primary/90" onClick={() => setActiveTab("escrow")}>
                  Learn About Escrow
                </Button>
              </div>
              <div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-semibold text-lg">Payment Summary</h4>
                    <img 
                      src="https://assets-global.website-files.com/5e73a1e3ba24f239bc2359dc/61f1da382f5cece7d82a45a0_paystack-logo.png"
                      alt="Paystack Logo" 
                      className="h-8" 
                    />
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Rent Amount:</span>
                      <span className="font-bold">₦500,000</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 text-sm border-t border-dashed border-gray-300 pt-2 mt-2">
                      <span className="text-gray-600">Platform Fee (5%):</span>
                      <span>₦25,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Landlord Receives:</span>
                      <span>₦475,000</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-green-600 hover:bg-green-700 mb-4">
                    Pay with Paystack
                  </Button>
                  
                  <div className="flex justify-center space-x-4">
                    <img src="https://res.cloudinary.com/paystack/image/upload/v1653566331/visa-logo_sdgm3l.png" alt="Visa" className="h-5" />
                    <img src="https://res.cloudinary.com/paystack/image/upload/v1653566331/mastercard-logo_ktxsnf.png" alt="Mastercard" className="h-5" />
                    <img src="https://nigerianbanks.xyz/logo/verve-logo.png" alt="Verve" className="h-5" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="escrow" className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-naija-dark">Escrow Protection</h3>
                </div>
                <p className="mb-6 text-gray-600">
                  Our escrow service holds tenant payments securely until they confirm satisfaction 
                  with the property. This protects tenants from fraudulent listings and ensures 
                  landlords receive payment once the tenant is satisfied.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">How Escrow Works</h4>
                    <ol className="text-gray-700 text-sm space-y-2">
                      <li className="flex items-start">
                        <div className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</div>
                        <span>Tenant makes payment which is held securely in escrow</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</div>
                        <span>Tenant visits and inspects the property</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">3</div>
                        <span>If satisfied, tenant confirms and payment is released to landlord</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">4</div>
                        <span>If there are issues, tenant can dispute the payment</span>
                      </li>
                    </ol>
                  </div>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      <span>Protection from scams and fraudulent listings</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      <span>72-hour inspection period for tenants</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      <span>Automatic release if no issues are reported</span>
                    </li>
                  </ul>
                </div>
                
                <Button className="mt-6 bg-naija-primary hover:bg-naija-primary/90" onClick={() => setActiveTab("dispute")}>
                  Learn About Disputes
                </Button>
              </div>
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
                  <div className="flex items-center mb-6">
                    <Shield className="h-6 w-6 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-lg">Escrow Payment Status</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Payment Amount:</span>
                        <span className="font-bold">₦500,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Status:</span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                          In Escrow
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Release Funds
                      </Button>
                      <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-50">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Report Issue
                      </Button>
                    </div>
                    
                    <div className="text-sm text-center text-gray-500 pt-2">
                      Inspection period ends in: <span className="font-medium">48 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dispute" className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-8 w-8 text-amber-500 mr-3" />
                  <h3 className="text-2xl font-bold text-naija-dark">Dispute Resolution</h3>
                </div>
                <p className="mb-6 text-gray-600">
                  If there's an issue with a property, our simple dispute process helps protect 
                  tenant funds while our team investigates the situation. We aim to resolve all 
                  disputes fairly and quickly.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Dispute Process</h4>
                    <ol className="text-gray-700 text-sm space-y-2">
                      <li className="flex items-start">
                        <div className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</div>
                        <span>Tenant files a dispute with detailed explanation and evidence</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</div>
                        <span>Payment is marked as "disputed" and held securely</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">3</div>
                        <span>Our team investigates and contacts both parties</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">4</div>
                        <span>Resolution is reached and funds are released appropriately</span>
                      </li>
                    </ol>
                  </div>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      <span>Fair and transparent investigation process</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      <span>Option for partial refunds or full refunds</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      <span>Most disputes resolved within 5-7 business days</span>
                    </li>
                  </ul>
                </div>
                
                <Button className="mt-6 bg-naija-primary hover:bg-naija-primary/90" onClick={() => setActiveTab("secure")}>
                  Back to Payments
                </Button>
              </div>
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-amber-100">
                  <div className="flex items-center mb-6">
                    <AlertCircle className="h-6 w-6 text-amber-500 mr-2" />
                    <h4 className="font-semibold text-lg">Dispute Form Example</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Reason for dispute</label>
                      <select className="w-full border border-gray-300 rounded-md p-2">
                        <option>Property doesn't match description</option>
                        <option>Property is damaged or unsafe</option>
                        <option>No access to property</option>
                        <option>Amenities missing</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Description of issue</label>
                      <textarea 
                        className="w-full border border-gray-300 rounded-md p-2 h-24"
                        placeholder="Please provide details about the issue..."
                        readOnly
                      ></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Upload evidence (optional)</label>
                      <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                        <p className="text-sm text-gray-500">Drag photos or click to upload</p>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">
                      Submit Dispute
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PaymentSection;
