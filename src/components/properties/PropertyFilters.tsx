
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

interface FiltersProps {
  onApplyFilters: (filters: any) => void;
}

const PropertyFilters = ({ onApplyFilters }: FiltersProps) => {
  const [priceRange, setPriceRange] = useState([300000, 3000000]);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  const handleFeatureChange = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      priceRange,
      location,
      propertyType,
      bedrooms,
      bathrooms,
      features,
    });
  };

  const handleReset = () => {
    setPriceRange([300000, 3000000]);
    setLocation("");
    setPropertyType("");
    setBedrooms("");
    setBathrooms("");
    setFeatures([]);
    onApplyFilters({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-bold text-xl mb-4">Filters</h3>
      
      <Accordion type="single" collapsible defaultValue="price" className="space-y-4">
        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline font-semibold">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[300000, 3000000]}
                min={0}
                max={10000000}
                step={50000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mt-6"
              />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Min</Label>
                  <div className="border rounded p-2 mt-1">
                    ₦{priceRange[0].toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>Max</Label>
                  <div className="border rounded p-2 mt-1">
                    ₦{priceRange[1].toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="location" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline font-semibold">
            Location
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="abuja">Abuja</SelectItem>
                  <SelectItem value="ph">Port Harcourt</SelectItem>
                  <SelectItem value="ibadan">Ibadan</SelectItem>
                  <SelectItem value="kano">Kano</SelectItem>
                </SelectContent>
              </Select>
              
              {location && (
                <div className="mt-2">
                  <Label htmlFor="specific-location" className="text-sm">Area/Neighborhood</Label>
                  <Input 
                    id="specific-location" 
                    placeholder="E.g., Lekki Phase 1"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="property-type" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline font-semibold">
            Property Type
          </AccordionTrigger>
          <AccordionContent>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="shortlet">Shortlet</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="rooms" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline font-semibold">
            Bedrooms & Bathrooms
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bedrooms</Label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Bathrooms</Label>
                <Select value={bathrooms} onValueChange={setBathrooms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="features" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline font-semibold">
            Features
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {["Air Conditioning", "Swimming Pool", "Balcony", "Gym", "Security", "Furnished", "Parking", "Elevator"].map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`feature-${feature}`} 
                    checked={features.includes(feature)}
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex space-x-2 mt-6">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button 
          className="flex-1 bg-naija-primary hover:bg-naija-primary/90"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
