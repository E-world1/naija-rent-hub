
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PropertyBasicInfo from "./PropertyBasicInfo";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import PropertyFeatures from "./PropertyFeatures";
import PropertyImages from "./PropertyImages";
import { Button } from "@/components/ui/button";

const AddPropertyForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [propertyData, setPropertyData] = useState({
    title: "",
    description: "",
    type: "",
    price: "",
    period: "monthly",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    state: "",
    lga: "",
    area: "",
    address: "",
    features: [] as string[],
    coordinates: { lat: "", lng: "" },
  });
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);

  const handlePropertyDataChange = (newData: Partial<typeof propertyData>) => {
    setPropertyData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleShowMap = (show: boolean) => {
    setShowMap(show);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!propertyData.title || !propertyData.price || !propertyData.state || !propertyData.lga) {
      toast.error("Missing Information", {
        description: "Please fill all required fields."
      });
      return;
    }
    
    if (uploadedImages.length === 0) {
      toast.error("No Images", {
        description: "Please upload at least one image of the property."
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create property in Supabase
      const { data, error } = await supabase
        .from('properties')
        .insert([
          {
            title: propertyData.title,
            description: propertyData.description,
            type: propertyData.type,
            price: propertyData.price,
            period: propertyData.period,
            bedrooms: parseInt(propertyData.bedrooms) || 0,
            bathrooms: parseInt(propertyData.bathrooms) || 0,
            square_feet: propertyData.squareFeet,
            state: propertyData.state,
            lga: propertyData.lga,
            area: propertyData.area,
            address: propertyData.address,
            features: propertyData.features,
            image: uploadedImages[0], // Using first image as main image
            images: uploadedImages,
            agent_id: user?.id,
            status: 'active'
          }
        ]);

      if (error) throw error;

      toast.success("Property Added", {
        description: "Your property has been listed successfully."
      });
      
      console.log("Property created:", data);
      navigate("/my-listings");
    } catch (error: any) {
      console.error("Error creating property:", error);
      toast.error("Error", {
        description: error.message || "Failed to create property listing."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PropertyBasicInfo 
        propertyData={propertyData}
        onChange={handlePropertyDataChange}
      />
      
      <PropertyDetails 
        propertyData={propertyData}
        onChange={handlePropertyDataChange}
      />
      
      <PropertyLocation
        propertyData={propertyData}
        onChange={handlePropertyDataChange}
        showMap={showMap}
        onShowMap={handleShowMap}
      />
      
      <PropertyFeatures 
        selectedFeatures={propertyData.features}
        onChange={(features) => handlePropertyDataChange({ features })}
      />
      
      <PropertyImages 
        isLoading={isLoading}
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
      />
      
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-naija-primary hover:bg-naija-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Add Property"}
        </Button>
      </div>
    </form>
  );
};

export default AddPropertyForm;
