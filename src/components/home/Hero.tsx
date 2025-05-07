
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
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
          
          <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto mb-8">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Enter location, area or property type..."
                className="w-full py-6 px-4 rounded-l-lg text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-naija-secondary hover:bg-naija-secondary/90 text-black py-6 px-6 rounded-r-lg"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          
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
