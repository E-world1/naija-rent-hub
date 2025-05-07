
import { useState } from "react";
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
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddPropertyForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    location: "",
    state: "",
    area: "",
    address: "",
    features: [] as string[],
  });
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

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
        
        toast({
          title: "Images Uploaded",
          description: `${e.target.files?.length} images have been uploaded.`,
        });
      }, 2000);
    }
  };
  
  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!propertyData.title || !propertyData.price || !propertyData.state || !propertyData.area) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (uploadedImages.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload at least one image of the property.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Property Added",
        description: "Your property has been listed successfully.",
      });
      
      navigate("/my-listings");
    }, 2000);
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
              <SelectContent>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="abuja">Abuja</SelectItem>
                <SelectItem value="rivers">Rivers</SelectItem>
                <SelectItem value="oyo">Oyo</SelectItem>
                <SelectItem value="kano">Kano</SelectItem>
                <SelectItem value="enugu">Enugu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="area">Area/City *</Label>
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
            <Input
              id="address"
              name="address"
              value={propertyData.address}
              onChange={handleChange}
              placeholder="Full address of the property"
            />
          </div>
        </div>
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
