
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nigerianStates, lgasByState } from "@/data/nigerianStatesAndLgas";
import GoogleMap from "@/components/maps/GoogleMap";
import { useToast } from "@/hooks/use-toast";

interface PropertyData {
  state: string;
  lga: string;
  area: string;
  address: string;
  [key: string]: any;
}

interface PropertyLocationProps {
  propertyData: PropertyData;
  onChange: (data: Partial<PropertyData>) => void;
  showMap: boolean;
  onShowMap: (show: boolean) => void;
}

const PropertyLocation = ({ 
  propertyData, 
  onChange, 
  showMap, 
  onShowMap 
}: PropertyLocationProps) => {
  const { toast } = useToast();
  const [availableLgas, setAvailableLgas] = useState<string[]>([]);

  // Update available LGAs when state changes
  useEffect(() => {
    if (propertyData.state) {
      setAvailableLgas(lgasByState[propertyData.state] || []);
      // Reset LGA when state changes
      if (!lgasByState[propertyData.state]?.includes(propertyData.lga)) {
        onChange({ lga: "" });
      }
    } else {
      setAvailableLgas([]);
    }
  }, [propertyData.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    onChange({ [name]: value });
  };
  
  const handleLocationSearch = () => {
    // Show the map for location selection if we have state, lga, and area
    if (propertyData.state && propertyData.lga) {
      onShowMap(true);
    } else {
      toast({
        title: "Missing Location Info",
        description: "Please select at least state and LGA before pinning location on map.",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};

export default PropertyLocation;
