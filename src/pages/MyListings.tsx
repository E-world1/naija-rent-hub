
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ListingCard from "@/components/listings/ListingCard";
import StatusFilterButtons from "@/components/listings/StatusFilterButtons";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Property {
  id: number;
  title: string;
  description: string | null;
  type: string | null;
  price: string;
  period: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: string | null;
  state: string;
  lga: string;
  area: string | null;
  address: string | null;
  features: string[] | null;
  image: string | null;
  images: string[] | null;
  agent_id: string | null;
  status: string | null;
  views: number | null;
  created_at: string;
  updated_at: string;
}

const MyListings = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error: any) {
      console.error("Error fetching properties:", error);
      toast.error("Error loading properties", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    
    if (filter === "all") {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(property => property.status === filter);
      setFilteredProperties(filtered);
    }
  };

  const handleDeleteProperty = async (propertyId: number) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      // Remove from local state
      const updatedProperties = properties.filter(p => p.id !== propertyId);
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties.filter(property => 
        activeFilter === "all" || property.status === activeFilter
      ));

      toast.success("Property deleted successfully");
    } catch (error: any) {
      console.error("Error deleting property:", error);
      toast.error("Error deleting property", {
        description: error.message
      });
    }
  };

  const handleStatusChange = async (propertyId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId);

      if (error) throw error;

      // Update local state
      const updatedProperties = properties.map(p => 
        p.id === propertyId ? { ...p, status: newStatus } : p
      );
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties.filter(property => 
        activeFilter === "all" || property.status === activeFilter
      ));

      toast.success(`Property status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Error updating property status:", error);
      toast.error("Error updating property status", {
        description: error.message
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-naija-primary mr-2" />
          <span>Loading your listings...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Property Listings</h1>
          <Link to="/add-property">
            <Button className="bg-naija-primary hover:bg-naija-primary/90">
              <Plus className="h-5 w-5 mr-2" />
              Add New Property
            </Button>
          </Link>
        </div>

        <StatusFilterButtons 
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <Plus className="h-16 w-16 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {activeFilter === "all" ? "No properties listed yet" : `No ${activeFilter} properties`}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeFilter === "all" 
                ? "Start by adding your first property listing."
                : `You don't have any ${activeFilter} properties at the moment.`
              }
            </p>
            {activeFilter === "all" && (
              <Link to="/add-property">
                <Button className="bg-naija-primary hover:bg-naija-primary/90">
                  Add Your First Property
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <ListingCard
                key={property.id}
                property={{
                  id: property.id,
                  title: property.title,
                  price: `₦${property.price}`,
                  period: property.period || 'monthly',
                  image: property.image || '',
                  bedrooms: property.bedrooms || 0,
                  status: property.status || 'active',
                  views: property.views || 0,
                  created_at: property.created_at,
                  state: property.state,
                  lga: property.lga,
                  area: property.area
                }}
                onDelete={() => handleDeleteProperty(property.id)}
                onStatusUpdate={(newStatus) => handleStatusChange(property.id, newStatus)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyListings;
