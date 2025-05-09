
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, MoreHorizontal, Edit, Trash, Eye, MapPin, Bed, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Define Property type to match database structure
interface Property {
  id: number;
  title: string;
  location?: string;
  price: string;
  period: string;
  image: string;
  bedrooms: number;
  status: string;
  views?: number;
  date?: string;
  created_at: string;
  state: string;
  lga: string;
  area?: string;
}

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

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "rented":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  // Format location string from state, lga, area
  const formatLocation = (property: Property) => {
    const parts = [
      property.area,
      property.lga,
      property.state
    ].filter(Boolean);
    return parts.join(', ');
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

        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-naija-primary" : ""}
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              onClick={() => setFilter("active")}
              className={filter === "active" ? "bg-green-500" : ""}
            >
              Active
            </Button>
            <Button
              variant={filter === "inactive" ? "default" : "outline"}
              onClick={() => setFilter("inactive")}
              className={filter === "inactive" ? "bg-gray-500" : ""}
            >
              Inactive
            </Button>
            <Button
              variant={filter === "rented" ? "default" : "outline"}
              onClick={() => setFilter("rented")}
              className={filter === "rented" ? "bg-blue-500" : ""}
            >
              Rented
            </Button>
          </div>
        </div>

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
              <Card key={listing.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 h-48 md:h-auto">
                      <img 
                        src={listing.image} 
                        alt={listing.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-3/4 p-4 md:p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold">{listing.title}</h3>
                            <Badge className={`ml-2 ${getStatusColor(listing.status)}`}>
                              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-gray-600 mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{formatLocation(listing)}</span>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className="text-xl font-bold text-naija-dark">{listing.price}</span>
                          <span className="text-gray-500 ml-1 text-sm">/ {listing.period}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 my-4">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm">{listing.bedrooms} Bedrooms</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-sm">{listing.views || 0} Views</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6m-6 0v10a2 2 0 002 2h2a2 2 0 002-2V7" />
                          </svg>
                          <span className="text-sm">Listed on {new Date(listing.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Link to={`/property/${listing.id}`} className="flex items-center">
                              <Eye className="mr-1 h-4 w-4" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Link to={`/edit-property/${listing.id}`} className="flex items-center">
                              <Edit className="mr-1 h-4 w-4" />
                              Edit
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                <Trash className="mr-1 h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this property listing. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteListing(listing.id)}
                                  className="bg-red-600 text-white hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusUpdate(listing.id, "active")}>
                              Mark as Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(listing.id, "inactive")}>
                              Mark as Inactive
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(listing.id, "rented")}>
                              Mark as Rented
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyListings;
