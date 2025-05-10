
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyData {
  price: string;
  period: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  [key: string]: any;
}

interface PropertyDetailsProps {
  propertyData: PropertyData;
  onChange: (data: Partial<PropertyData>) => void;
}

const PropertyDetails = ({ propertyData, onChange }: PropertyDetailsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    onChange({ [name]: value });
  };

  return (
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
  );
};

export default PropertyDetails;
