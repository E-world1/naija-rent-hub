
import { useEffect, useRef } from "react";

interface GoogleMapProps {
  location: string;
  address?: string;
  height?: string;
  zoom?: number;
}

const GoogleMap = ({ location, address, height = "400px", zoom = 15 }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize the map once the component mounts
    const initMap = async () => {
      if (!mapRef.current) return;
      
      // Load Google Maps script dynamically
      if (!window.google) {
        const googleMapsScript = document.createElement("script");
        googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY || ""}`;
        googleMapsScript.async = true;
        googleMapsScript.defer = true;
        document.head.appendChild(googleMapsScript);
        
        // Wait for script to load
        await new Promise<void>((resolve) => {
          googleMapsScript.onload = () => resolve();
        });
      }
      
      // Geocode the location to get coordinates
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: location + (address ? ", " + address : "") }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const map = new window.google.maps.Map(mapRef.current!, {
            center: results[0].geometry.location,
            zoom: zoom,
          });
          
          // Add a marker for the property location
          new window.google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            title: location,
          });
        } else {
          console.error("Geocode was not successful for the following reason:", status);
          // Show a fallback map centered on Nigeria if geocoding fails
          const nigeriaCoords = { lat: 9.0820, lng: 8.6753 };
          const map = new window.google.maps.Map(mapRef.current!, {
            center: nigeriaCoords,
            zoom: 6,
          });
        }
      });
    };

    initMap();
  }, [location, address, zoom]);

  return <div ref={mapRef} style={{ width: "100%", height, borderRadius: "0.5rem" }} />;
};

export default GoogleMap;
