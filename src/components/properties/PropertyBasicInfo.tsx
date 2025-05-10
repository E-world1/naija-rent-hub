
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

interface PropertyData {
  title: string;
  description: string;
  type: string;
  [key: string]: any;
}

interface PropertyBasicInfoProps {
  propertyData: PropertyData;
  onChange: (data: Partial<PropertyData>) => void;
}

const PropertyBasicInfo = ({ propertyData, onChange }: PropertyBasicInfoProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    onChange({ [name]: value });
  };

  return (
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
  );
};

export default PropertyBasicInfo;
