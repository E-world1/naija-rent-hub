
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Locate } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Hero = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleUseMyLocation = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // In a real application, you would use reverse geocoding to get the address
          // For now, we'll navigate with the coordinates
          navigate(`/properties?lat=${latitude}&lng=${longitude}`);
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please check your browser permissions.",
            variant: "destructive",
          });
          setIsLocating(false);
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      setIsLocating(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-naija-primary/90 via-naija-primary/80 to-naija-primary/90 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3')" }}
      ></div>
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find Your Perfect Home in Nigeria
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Browse thousands of properties for rent across Nigeria's major cities
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full max-w-lg mx-auto mb-4">
            <div className="relative flex-grow mb-2 sm:mb-0">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                type="text"
                placeholder="Enter location, area or property type..."
                className="w-full py-6 pl-10 rounded-l-lg text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-naija-secondary hover:bg-naija-secondary/90 text-black py-6 px-6 sm:rounded-l-none rounded-lg sm:rounded-r-lg"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          
          <Button 
            variant="ghost" 
            className="mb-8 border border-white/30 text-white hover:bg-white/10"
            onClick={handleUseMyLocation}
            disabled={isLocating}
          >
            <Locate className="h-4 w-4 mr-2" />
            {isLocating ? "Getting your location..." : "Use my current location"}
          </Button>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-naija-primary">
              Lagos
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-naija-primary">
              Abuja
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-naija-primary">
              Port Harcourt
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-naija-primary">
              Ibadan
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-naija-primary">
              Kano
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
