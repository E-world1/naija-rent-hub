
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import MapKeySetup from "./MapKeySetup";

interface MapContextType {
  apiKeySet: boolean;
  setApiKeySet: (value: boolean) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [apiKeySet, setApiKeySet] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    // Check if we already have an API key
    const storedApiKey = localStorage.getItem("GOOGLE_MAPS_API_KEY");
    
    if (storedApiKey) {
      window.googleMapsApiKey = storedApiKey;
      setApiKeySet(true);
    } else {
      setNeedsSetup(true);
    }
  }, []);

  const handleKeySet = () => {
    setApiKeySet(true);
    setNeedsSetup(false);
  };

  return (
    <MapContext.Provider value={{ apiKeySet, setApiKeySet }}>
      {needsSetup ? (
        <div className="container mx-auto px-4 py-8">
          <MapKeySetup onKeySet={handleKeySet} />
        </div>
      ) : (
        children
      )}
    </MapContext.Provider>
  );
};
