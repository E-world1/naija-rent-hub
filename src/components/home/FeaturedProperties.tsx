
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Search } from "lucide-react";

// Mock data for featured properties
const featuredProperties = [
  {
    id: 1,
    title: "Luxury 3 Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "₦1,500,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    bedrooms: 3,
    featured: true,
    agent: "Lagos Homes",
  },
  {
    id: 2,
    title: "Modern 2 Bedroom Flat",
    location: "Wuse Zone 6, Abuja",
    price: "₦1,200,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    bedrooms: 2,
    featured: true,
    agent: "Capital City Properties",
  },
  {
    id: 3,
    title: "Spacious 4 Bedroom Duplex",
    location: "GRA Phase 2, Port Harcourt",
    price: "₦2,500,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    bedrooms: 4,
    featured: true,
    agent: "Rivers Homes",
  },
  {
    id: 4,
    title: "Cozy 1 Bedroom Studio",
    location: "Ikeja GRA, Lagos",
    price: "₦800,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    bedrooms: 1,
    featured: false,
    agent: "Metro Realtors",
  },
];

const FeaturedProperties = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-naija-dark">Featured Properties</h2>
          <Link 
            to="/properties" 
            className="flex items-center text-naija-primary hover:underline font-medium"
          >
            View all <Search className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <Link to={`/property/${property.id}`} key={property.id}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 property-card-shadow h-full">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {property.featured && (
                    <Badge className="absolute top-2 right-2 bg-naija-secondary text-black">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <span className="text-xl font-bold text-naija-dark">{property.price}</span>
                    <span className="text-gray-500 ml-1 text-sm">/ {property.period}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-naija-dark">{property.title}</h3>
                  <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center text-gray-600">
                      <Bed className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.bedrooms} Beds</span>
                    </div>
                    <div className="text-sm text-naija-primary font-medium">
                      {property.agent}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
