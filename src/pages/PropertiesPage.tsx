import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PropertyCard, { Property } from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";

// Mock data
const mockProperties: Property[] = [
  {
    id: 1,
    title: "Luxury 3 Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "₦1,500,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    bedrooms: 3,
    bathrooms: 2,
    featured: true,
    agent: "Lagos Homes",
    type: "Apartment",
  },
  {
    id: 2,
    title: "Modern 2 Bedroom Flat",
    location: "Wuse Zone 6, Abuja",
    price: "₦1,200,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    bedrooms: 2,
    bathrooms: 1,
    featured: true,
    agent: "Capital City Properties",
    type: "Flat",
  },
  {
    id: 3,
    title: "Spacious 4 Bedroom Duplex",
    location: "GRA Phase 2, Port Harcourt",
    price: "₦2,500,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    bedrooms: 4,
    bathrooms: 3,
    featured: true,
    agent: "Rivers Homes",
    type: "Duplex",
  },
  {
    id: 4,
    title: "Cozy 1 Bedroom Studio",
    location: "Ikeja GRA, Lagos",
    price: "₦800,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    bedrooms: 1,
    bathrooms: 1,
    agent: "Metro Realtors",
    type: "Studio",
  },
  {
    id: 5,
    title: "Executive 5 Bedroom Mansion",
    location: "Banana Island, Lagos",
    price: "₦5,000,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1475&ixlib=rb-4.0.3",
    bedrooms: 5,
    bathrooms: 5,
    agent: "Luxury Homes Nigeria",
    type: "Mansion",
  },
  {
    id: 6,
    title: "2 Bedroom Serviced Apartment",
    location: "Oniru Estate, Lagos",
    price: "₦1,800,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1474&ixlib=rb-4.0.3",
    bedrooms: 2,
    bathrooms: 2,
    agent: "Premium Properties",
    type: "Apartment",
  },
  {
    id: 7,
    title: "Commercial Shop Space",
    location: "Wuse Market, Abuja",
    price: "₦500,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    bedrooms: 0,
    bathrooms: 1,
    agent: "Business Space Realtors",
    type: "Commercial",
  },
  {
    id: 8,
    title: "3 Bedroom Bungalow",
    location: "Bodija, Ibadan",
    price: "₦950,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&q=80&w=1516&ixlib=rb-4.0.3",
    bedrooms: 3,
    bathrooms: 2,
    agent: "Ibadan Property Hub",
    type: "Bungalow",
  },
  {
    id: 9,
    title: "Premium Office Space",
    location: "Victoria Island, Lagos",
    price: "₦3,500,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1469&ixlib=rb-4.0.3",
    bedrooms: 0,
    bathrooms: 2,
    agent: "Corporate Realty",
    type: "Commercial",
  },
  {
    id: 10,
    title: "1 Bedroom Apartment",
    location: "Yaba, Lagos",
    price: "₦700,000",
    period: "yearly",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1474&ixlib=rb-4.0.3",
    bedrooms: 1,
    bathrooms: 1,
    agent: "Lagos Student Homes",
    type: "Apartment",
  },
];

const PropertiesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  
  // Parse query parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
      filterProperties({ search: searchParam });
    }
  }, [location.search]);
  
  const filterProperties = (filters: Record<string, any>) => {
    let filtered = [...properties];
    
    // Search query filter
    if (filters.search || searchQuery) {
      const query = (filters.search || searchQuery).toLowerCase();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.type?.toLowerCase().includes(query)
      );
    }
    
    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(property => {
        const price = parseInt(property.price.replace(/[^\d]/g, ""));
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }
    
    // Location filter
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property => 
        property.type?.toLowerCase().includes(filters.propertyType.toLowerCase())
      );
    }
    
    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(property => 
        property.bedrooms >= parseInt(filters.bedrooms)
      );
    }
    
    // Bathrooms filter
    if (filters.bathrooms) {
      filtered = filtered.filter(property => 
        property.bathrooms && property.bathrooms >= parseInt(filters.bathrooms)
      );
    }
    
    // Apply sorting
    applySort(filtered);
    
    setActiveFilters({ ...filters });
  };
  
  const applySort = (propertiesArray: Property[]) => {
    let sorted = [...propertiesArray];
    
    switch (sortOption) {
      case "price-asc":
        sorted = sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
          const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
          return priceA - priceB;
        });
        break;
      case "price-desc":
        sorted = sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
          const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
          return priceB - priceA;
        });
        break;
      case "newest":
        // In a real app, you'd sort by date
        // For now, we'll keep the original order
        break;
      default:
        break;
    }
    
    setFilteredProperties(sorted);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
      filterProperties({ search: searchQuery });
    }
  };
  
  const handleSort = (value: string) => {
    setSortOption(value);
    applySort(filteredProperties);
  };
  
  const handleApplyFilters = (filters: Record<string, any>) => {
    filterProperties({ ...filters, search: searchQuery });
    setShowFilters(false);
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setSortOption("newest");
    setActiveFilters({});
    navigate("/properties");
    setFilteredProperties(properties);
  };

  return (
    <Layout>
      <div className="bg-naija-accent py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Rental</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-grow flex">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search by location, property type..."
                  className="w-full py-6 rounded-l-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="bg-naija-primary hover:bg-naija-primary/90 py-6 rounded-l-none"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
            
            <div className="md:w-48">
              <Select value={sortOption} onValueChange={handleSort}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="outline"
              className="md:w-auto flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </Button>
          </div>
          
          {/* Active filters */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {Object.keys(activeFilters).map(key => {
                if (key === "search" || key === "features") return null;
                
                let label = "";
                if (key === "priceRange") {
                  label = `₦${activeFilters[key][0].toLocaleString()} - ₦${activeFilters[key][1].toLocaleString()}`;
                } else if (key === "bedrooms") {
                  label = `${activeFilters[key]}+ Bedrooms`;
                } else if (key === "bathrooms") {
                  label = `${activeFilters[key]}+ Bathrooms`;
                } else {
                  label = activeFilters[key];
                }
                
                return (
                  <div key={key} className="bg-gray-200 text-gray-800 text-sm rounded-full px-3 py-1 flex items-center">
                    {label}
                    <button 
                      onClick={() => {
                        const newFilters = { ...activeFilters };
                        delete newFilters[key];
                        filterProperties(newFilters);
                      }}
                      className="ml-2 text-gray-600 hover:text-gray-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
              
              <button
                onClick={clearFilters}
                className="text-naija-primary hover:underline text-sm"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar - always visible on desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <PropertyFilters onApplyFilters={handleApplyFilters} />
          </div>
          
          {/* Mobile filters - conditionally shown */}
          {showFilters && (
            <div className="lg:hidden w-full">
              <PropertyFilters onApplyFilters={handleApplyFilters} />
            </div>
          )}
          
          {/* Properties grid */}
          <div className="lg:w-3/4">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">{filteredProperties.length} properties found</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertiesPage;
