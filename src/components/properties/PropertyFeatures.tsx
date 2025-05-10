
import { Checkbox } from "@/components/ui/checkbox";

interface PropertyFeaturesProps {
  selectedFeatures: string[];
  onChange: (features: string[]) => void;
}

const PROPERTY_FEATURES = [
  "Air Conditioning", "Swimming Pool", "Balcony", "Gym",
  "Security", "Furnished", "Parking", "Elevator", 
  "Backup Power", "Waterfront", "Pet Friendly", "24/7 Electricity"
];

const PropertyFeatures = ({ selectedFeatures, onChange }: PropertyFeaturesProps) => {
  const handleFeatureChange = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      onChange(selectedFeatures.filter(f => f !== feature));
    } else {
      onChange([...selectedFeatures, feature]);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Features & Amenities</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PROPERTY_FEATURES.map((feature) => (
          <div key={feature} className="flex items-center space-x-2">
            <Checkbox 
              id={`feature-${feature}`} 
              checked={selectedFeatures.includes(feature)}
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
  );
};

export default PropertyFeatures;
