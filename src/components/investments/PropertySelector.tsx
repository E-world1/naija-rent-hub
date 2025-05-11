
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

interface PropertySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PropertySelector = ({ value, onChange }: PropertySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Fetch properties that are not already investment properties
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, type, location')
        .eq('status', 'active')
        .not('id', 'in', '(select property_id from investment_properties where property_id is not null)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedProperty = properties.find(property => property.id.toString() === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value && selectedProperty
            ? `${selectedProperty.title} - ${selectedProperty.location}`
            : "Select property..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search properties..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader className="h-4 w-4 animate-spin mr-2" />
                <p>Loading properties...</p>
              </div>
            ) : (
              <>
                <CommandEmpty>No properties found.</CommandEmpty>
                <CommandGroup heading="Available Properties">
                  {properties.map(property => (
                    <CommandItem
                      key={property.id}
                      value={property.id.toString()}
                      onSelect={(currentValue) => {
                        onChange(currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === property.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{property.title}</span>
                        <span className="text-xs text-gray-500">
                          {property.type} | {property.location}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PropertySelector;
