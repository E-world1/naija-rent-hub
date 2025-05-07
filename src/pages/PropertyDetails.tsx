
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PaystackCheckout from "@/components/payment/PaystackCheckout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, User, CreditCard, Calendar, Home, CheckSquare } from "lucide-react";

// Mock data
const mockProperty = {
  id: 1,
  title: "Luxury 3 Bedroom Apartment",
  description: "This beautiful 3 bedroom apartment is located in the heart of Lekki Phase 1. It features modern amenities, 24/7 electricity, water supply, and security. The apartment is fully furnished with high-quality furniture and appliances. The kitchen is equipped with modern appliances and the bathrooms are fitted with quality fixtures. The apartment also has a balcony with a stunning view of the city. It's perfect for a family or professionals looking for comfort and convenience.",
  location: "Lekki Phase 1, Lagos",
  address: "123 Admiralty Way, Lekki Phase 1, Lagos",
  price: "₦1,500,000",
  period: "yearly",
  images: [
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1474&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
  ],
  bedrooms: 3,
  bathrooms: 2,
  squareFeet: "120 sqm",
  features: [
    "Air Conditioning",
    "Swimming Pool",
    "24/7 Electricity",
    "Security",
    "Furnished",
    "Parking Space",
    "Water Supply",
  ],
  agent: {
    name: "Lagos Homes",
    phone: "+234 801 234 5678",
    email: "info@lagoshomes.com",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1374&ixlib=rb-4.0.3",
  },
  type: "Apartment",
  available: true,
  postedDate: "2023-05-07",
  securityDeposit: "₦500,000",
};

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  // In a real app, we would fetch the property data based on the ID
  const property = mockProperty;
  
  const handleContactAgent = () => {
    toast({
      title: "Contact Request Sent",
      description: `Your contact request has been sent to ${property.agent.name}.`,
    });
  };
  
  const handleTourRequest = () => {
    toast({
      title: "Tour Request Sent",
      description: "Your property tour request has been submitted successfully.",
    });
  };
  
  const handlePaymentSuccess = () => {
    setIsPaymentDialogOpen(false);
    toast({
      title: "Payment Successful",
      description: "Your rental payment has been processed. Check your email for details.",
    });
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-NG', options);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/properties" className="text-naija-primary hover:underline">
            &larr; Back to Properties
          </Link>
        </div>
        
        {/* Property title and badges */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="h-5 w-5 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Badge className="bg-naija-secondary text-black">
              {property.available ? "Available" : "Not Available"}
            </Badge>
            <Badge className="bg-naija-primary">
              {property.type}
            </Badge>
          </div>
        </div>
        
        {/* Property images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative h-96">
              <img 
                src={property.images[selectedImage]}
                alt={property.title} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {property.images.slice(0, 3).map((image, index) => (
              <div 
                key={index}
                className={`cursor-pointer h-28 md:h-[30%] relative ${selectedImage === index ? 'ring-2 ring-naija-primary' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={image} 
                  alt={`${property.title} ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {index === 2 && property.images.length > 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                    <span className="text-white font-medium">
                      +{property.images.length - 3} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Property details and agent info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Property Details</TabsTrigger>
                <TabsTrigger value="features">Features & Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex flex-col items-center p-2 text-center">
                    <Home className="h-5 w-5 text-naija-primary mb-1" />
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="font-medium">{property.type}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 text-center">
                    <svg className="h-5 w-5 text-naija-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" />
                    </svg>
                    <span className="text-sm text-gray-600">Area</span>
                    <span className="font-medium">{property.squareFeet}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 text-center">
                    <svg className="h-5 w-5 text-naija-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-sm text-gray-600">Bedrooms</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 text-center">
                    <svg className="h-5 w-5 text-naija-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12h-8v8H3V3h18v9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l6 6m0-6L3 12" />
                    </svg>
                    <span className="text-sm text-gray-600">Bathrooms</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold">Description</h3>
                <p className="text-gray-600">{property.description}</p>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-xl font-semibold mb-2">Property Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-naija-primary mr-2" />
                      <div>
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="ml-2 font-medium">{property.price}</span>
                        <span className="text-gray-500 text-sm"> / {property.period}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-naija-primary mr-2" />
                      <div>
                        <span className="text-sm text-gray-600">Security Deposit:</span>
                        <span className="ml-2 font-medium">{property.securityDeposit}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-naija-primary mr-2" />
                      <div>
                        <span className="text-sm text-gray-600">Available From:</span>
                        <span className="ml-2 font-medium">Immediately</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-naija-primary mr-2" />
                      <div>
                        <span className="text-sm text-gray-600">Posted On:</span>
                        <span className="ml-2 font-medium">{formatDate(property.postedDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features">
                <h3 className="text-xl font-semibold mb-4">Features & Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckSquare className="h-5 w-5 text-naija-primary mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="location">
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <p className="text-gray-600 mb-4">{property.address}</p>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-naija-primary mx-auto mb-2" />
                    <p className="text-gray-600">Map view will be displayed here</p>
                    <p className="text-sm text-gray-500">Integrated with Google Maps or similar service</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Nearby Amenities:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Shopping Centers (2km)</li>
                    <li>Schools and Universities (1.5km)</li>
                    <li>Medical Centers (3km)</li>
                    <li>Public Transportation (500m)</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Agent information and contact */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                  <img 
                    src={property.agent.image} 
                    alt={property.agent.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{property.agent.name}</h3>
                  <p className="text-sm text-gray-600">Property Agent</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-naija-primary mr-3" />
                  <span>{property.agent.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-naija-primary mr-3" />
                  <span>{property.agent.email}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-naija-primary hover:bg-naija-primary/90"
                  onClick={handleContactAgent}
                >
                  Contact Agent
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleTourRequest}
                >
                  Request a Tour
                </Button>
                <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Rent Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Complete Your Rental Payment</DialogTitle>
                      <DialogDescription>
                        Pay securely via Paystack to secure this property.
                      </DialogDescription>
                    </DialogHeader>
                    <PaystackCheckout
                      amount={1500000} // Extracted from property price
                      description={`Rent payment for ${property.title}`}
                      onSuccess={handlePaymentSuccess}
                      onClose={() => setIsPaymentDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetails;
