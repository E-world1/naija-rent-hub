
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MapKeySetup = ({ onKeySet }: { onKeySet: () => void }) => {
  const [apiKey, setApiKey] = useState("");
  
  const handleSaveKey = () => {
    if (apiKey) {
      // In a real app, we would use environment variables or a backend service
      // For demonstration purposes, we're using localStorage
      localStorage.setItem("GOOGLE_MAPS_API_KEY", apiKey);
      
      // Set the key on window for immediate use
      window.googleMapsApiKey = apiKey;
      
      onKeySet();
    }
  };
  
  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-bold mb-4">Set Up Google Maps</h3>
      
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          For map functionality to work, you need to provide your Google Maps API key.
          Get a key from the <a href="https://console.cloud.google.com/google/maps-apis/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="api-key">Google Maps API Key</Label>
          <Input
            id="api-key"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be stored in your browser's local storage.
          </p>
        </div>
        
        <Button
          onClick={handleSaveKey}
          className="bg-naija-primary hover:bg-naija-primary/90"
          disabled={!apiKey}
        >
          Save and continue
        </Button>
      </div>
    </div>
  );
};

export default MapKeySetup;
