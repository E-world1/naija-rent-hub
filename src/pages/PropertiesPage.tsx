
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PropertyCard, { Property } from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PropertiesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  // Fetch actual properties from Supabase
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active');
        
        if (error) throw error;
        
        console.log("Fetched properties from Supabase:", data);
        
        const formattedProperties = data.map(item => ({
          id: item.id,
          title: item.title,
          location: `${item.area ? `${item.area}, ` : ''}${item.lga}, ${item.state}`,
          price: `₦${item.price}`,
          period: item.period,
          image: item.image,
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms || undefined,
          squareFeet: item.square_feet || undefined,
          featured: false, // Could be added as a column in the future
          agent: "Agent", // This should be fetched from profiles in a real implementation
          type: item.type || undefined,
        }));
        
        setProperties(formattedProperties);
        setFilteredProperties(formattedProperties);
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        toast.error("Error loading properties", {
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  
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
    
    // State filter
    if (filters.state) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.state.toLowerCase())
      );
    }
    
    // LGA filter
    if (filters.lga) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.lga.toLowerCase())
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
        // In a real app, we sort by created_at which we now have
        sorted = sorted.sort((a: any, b: any) => {
          return new Date(b.created_at || Date.now()).getTime() - 
                 new Date(a.created_at || Date.now()).getTime();
        });
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

  // Helper function to format filter label
  const getFilterLabel = (key: string, value: any) => {
    switch (key) {
      case "priceRange":
        return `₦${value[0].toLocaleString()} - ₦${value[1].toLocaleString()}`;
      case "bedrooms":
        return `${value}+ Bedrooms`;
      case "bathrooms":
        return `${value}+ Bathrooms`;
      case "state":
      case "lga":
      case "propertyType":
        return value;
      default:
        return value.toString();
    }
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
                if (!activeFilters[key]) return null;
                
                return (
                  <div key={key} className="bg-gray-200 text-gray-800 text-sm rounded-full px-3 py-1 flex items-center">
                    {getFilterLabel(key, activeFilters[key])}
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
              
              {activeFilters.features?.length > 0 && (
                <div className="bg-gray-200 text-gray-800 text-sm rounded-full px-3 py-1 flex items-center">
                  {`${activeFilters.features.length} Features`}
                  <button 
                    onClick={() => {
                      const newFilters = { ...activeFilters, features: [] };
                      filterProperties(newFilters);
                    }}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
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
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="h-8 w-8 animate-spin text-naija-primary mr-2" />
                <span>Loading properties...</span>
              </div>
            ) : filteredProperties.length === 0 ? (
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
