
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Home, CreditCard } from "lucide-react";
import ShareButton from "@/components/sharing/ShareButton";

export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  period: string;
  image: string;
  bedrooms: number;
  bathrooms?: number;
  squareFeet?: string; // Changed from number to string to match data from database
  featured?: boolean;
  agent: string;
  type?: string;
}

interface PropertyCardProps {
  property: Property;
  isLoggedIn?: boolean;
}

const PropertyCard = ({ property, isLoggedIn = false }: PropertyCardProps) => {
  return (
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
        {property.type && (
          <Badge className="absolute top-2 left-2 bg-white text-naija-primary">
            {property.type}
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
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <Bed className="h-4 w-4 text-gray-500" />
            <span className="text-xs mt-1">{property.bedrooms} Beds</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12h-8v8H3V3h18v9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l6 6m0-6L3 12" />
            </svg>
            <span className="text-xs mt-1">{property.bathrooms || 1} Bath</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <Home className="h-4 w-4 text-gray-500" />
            <span className="text-xs mt-1">{property.squareFeet || '80m²'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-sm text-naija-primary font-medium">
            {property.agent}
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <ShareButton 
                title={`Check out ${property.title} on NaijaRentHub`} 
                description={`${property.bedrooms} bedroom property in ${property.location} for ${property.price}/${property.period}`}
              />
            )}
            <Link to={`/property/${property.id}`}>
              <Button variant="ghost" size="sm" className="text-naija-primary hover:text-naija-primary/90 p-0">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
