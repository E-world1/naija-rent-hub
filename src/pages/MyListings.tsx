
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import ListingCard, { Property } from "@/components/listings/ListingCard";
import StatusFilterButtons from "@/components/listings/StatusFilterButtons";

const MyListings = () => {
  const { toast: uiToast } = useToast();
  const { user } = useAuth();
  const [listings, setListings] = useState<Property[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch listings from Supabase
  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('agent_id', user.id);
        
        if (error) throw error;
        
        console.log("Fetched properties:", data);
        setListings(data || []);
      } catch (error: any) {
        console.error("Error fetching listings:", error);
        setError(error.message);
        toast.error("Error loading properties", {
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  const filteredListings = filter === "all" 
    ? listings 
    : listings.filter(listing => listing.status === filter);

  const handleDeleteListing = async (id: number) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setListings(listings.filter(listing => listing.id !== id));
      
      uiToast({
        title: "Property Deleted",
        description: "The property has been removed from your listings.",
      });
    } catch (error: any) {
      console.error("Error deleting property:", error);
      toast.error("Error deleting property", {
        description: error.message
      });
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, status: newStatus } : listing
      ));
      
      uiToast({
        title: "Status Updated",
        description: `The property status has been updated to ${newStatus}.`,
      });
    } catch (error: any) {
      console.error("Error updating property status:", error);
      toast.error("Error updating status", {
        description: error.message
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 animate-spin text-naija-primary" />
            <span className="ml-2">Loading your properties...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2 text-red-700">Error Loading Properties</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-naija-primary hover:bg-naija-primary/90"
            >
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Property Listings</h1>
            <p className="text-gray-600 mt-2">Manage your rental properties</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-naija-primary hover:bg-naija-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              <Link to="/add-property">Add New Property</Link>
            </Button>
          </div>
        </div>

        <StatusFilterButtons 
          currentFilter={filter}
          onFilterChange={setFilter}
        />

        {filteredListings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">You don't have any {filter !== "all" ? filter : ""} listings yet.</p>
            <Button className="bg-naija-primary hover:bg-naija-primary/90">
              <Link to="/add-property">Add Your First Property</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredListings.map(listing => (
              <ListingCard 
                key={listing.id} 
                property={listing}
                onDelete={handleDeleteListing}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyListings;
