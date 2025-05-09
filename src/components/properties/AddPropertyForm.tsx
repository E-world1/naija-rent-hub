import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Upload, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { nigerianStates, lgasByState } from "@/data/nigerianStatesAndLgas";
import GoogleMap from "@/components/maps/GoogleMap";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const AddPropertyForm = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
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
  
  const [availableLgas, setAvailableLgas] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showMap, setShowMap] = useState(false);

  // Update available LGAs when state changes
  useEffect(() => {
    if (propertyData.state) {
      setAvailableLgas(lgasByState[propertyData.state] || []);
      // Reset LGA when state changes
      setPropertyData(prev => ({
        ...prev,
        lga: ""
      }));
    } else {
      setAvailableLgas([]);
    }
  }, [propertyData.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPropertyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setPropertyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleFeatureChange = (feature: string) => {
    setPropertyData((prev) => {
      const features = [...prev.features];
      if (features.includes(feature)) {
        return { ...prev, features: features.filter(f => f !== feature) };
      } else {
        return { ...prev, features: [...features, feature] };
      }
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Simulate upload
      setIsLoading(true);
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(0);
        setIsLoading(false);
        
        // Create dummy image URLs for demonstration
        const newImages = Array.from(e.target.files!).map((_, index) => 
          `https://source.unsplash.com/random/800x600?house&sig=${Date.now()+index}`
        );
        
        setUploadedImages((prev) => [...prev, ...newImages]);
        
        uiToast({
          title: "Images Uploaded",
          description: `${e.target.files?.length} images have been uploaded.`,
        });
      }, 2000);
    }
  };
  
  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleLocationSearch = () => {
    // Show the map for location selection if we have state, lga, and area
    if (propertyData.state && propertyData.lga) {
      setShowMap(true);
    } else {
      uiToast({
        title: "Missing Location Info",
        description: "Please select at least state and LGA before pinning location on map.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!propertyData.title || !propertyData.price || !propertyData.state || !propertyData.lga) {
      uiToast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (uploadedImages.length === 0) {
      uiToast({
        title: "No Images",
        description: "Please upload at least one image of the property.",
        variant: "destructive",
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
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Basic Information</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title *</Label>
            <Input
              id="title"
              name="title"
              value={propertyData.title}
              onChange={handleChange}
              placeholder="e.g., Spacious 3 Bedroom Apartment"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Property Type *</Label>
            <Select
              value={propertyData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial Space</SelectItem>
                <SelectItem value="shortlet">Shortlet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={propertyData.description}
            onChange={handleChange}
            placeholder="Describe the property, amenities, surroundings, etc."
            rows={5}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Property Details</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₦</span>
              <Input
                id="price"
                name="price"
                value={propertyData.price}
                onChange={handleChange}
                placeholder="e.g., 500000"
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="period">Rental Period *</Label>
            <Select
              value={propertyData.period}
              onValueChange={(value) => handleSelectChange("period", value)}
            >
              <SelectTrigger id="period">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={propertyData.bedrooms}
              onChange={handleChange}
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={propertyData.bathrooms}
              onChange={handleChange}
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="squareFeet">Square Feet/Meters</Label>
            <Input
              id="squareFeet"
              name="squareFeet"
              value={propertyData.squareFeet}
              onChange={handleChange}
              placeholder="e.g., 120 sq.m"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Location</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select
              value={propertyData.state}
              onValueChange={(value) => handleSelectChange("state", value)}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {nigerianStates.map((stateName) => (
                  <SelectItem key={stateName} value={stateName}>
                    {stateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lga">Local Government Area *</Label>
            <Select
              value={propertyData.lga}
              onValueChange={(value) => handleSelectChange("lga", value)}
              disabled={!propertyData.state}
            >
              <SelectTrigger id="lga">
                <SelectValue placeholder={propertyData.state ? "Select LGA" : "Select state first"} />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {availableLgas.map((lgaName) => (
                  <SelectItem key={lgaName} value={lgaName}>
                    {lgaName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="area">Area/Neighborhood</Label>
            <Input
              id="area"
              name="area"
              value={propertyData.area}
              onChange={handleChange}
              placeholder="e.g., Lekki Phase 1"
            />
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <div className="flex">
              <Input
                id="address"
                name="address"
                value={propertyData.address}
                onChange={handleChange}
                placeholder="Full address of the property"
                className="w-full"
              />
              <Button 
                type="button"
                variant="outline"
                className="ml-2 whitespace-nowrap"
                onClick={handleLocationSearch}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Pin on Map
              </Button>
            </div>
          </div>
        </div>
        
        {showMap && (
          <div className="mt-4">
            <p className="text-sm mb-2">Confirm your property location on the map:</p>
            <div className="h-[300px] rounded-lg overflow-hidden border">
              <GoogleMap 
                location={`${propertyData.area || ''}, ${propertyData.lga}, ${propertyData.state}, Nigeria`} 
                address={propertyData.address}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              For accurate location, provide as much detail as possible in the address field.
            </p>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Features & Amenities</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Air Conditioning", "Swimming Pool", "Balcony", "Gym",
            "Security", "Furnished", "Parking", "Elevator", 
            "Backup Power", "Waterfront", "Pet Friendly", "24/7 Electricity"
          ].map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox 
                id={`feature-${feature}`} 
                checked={propertyData.features.includes(feature)}
                onCheckedChange={() => handleFeatureChange(feature)}
              />
              <label
                htmlFor={`feature-${feature}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Images</h3>
        
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
          <input
            type="file"
            id="property-images"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isLoading}
          />
          
          <label
            htmlFor="property-images"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <Upload className="h-12 w-12 text-gray-400 mb-2" />
            <span className="text-lg font-medium">Drop your images here or click to browse</span>
            <span className="text-sm text-gray-500 mt-1">Support: JPG, PNG, WEBP (Max 5MB each)</span>
          </label>
          
          {isLoading && uploadProgress > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-naija-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="text-sm mt-2">Uploading... {uploadProgress}%</span>
            </div>
          )}
        </div>
        
        {uploadedImages.length > 0 && (
          <div>
            <Label className="mb-2 block">Uploaded Images</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
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
