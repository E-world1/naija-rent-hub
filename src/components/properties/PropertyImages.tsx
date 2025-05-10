
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface PropertyImagesProps {
  isLoading: boolean;
  uploadedImages: string[];
  setUploadedImages: (images: string[]) => void;
}

const PropertyImages = ({ 
  isLoading, 
  uploadedImages, 
  setUploadedImages 
}: PropertyImagesProps) => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Simulate upload
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(0);
        
        // Create dummy image URLs for demonstration
        const newImages = Array.from(e.target.files!).map((_, index) => 
          `https://source.unsplash.com/random/800x600?house&sig=${Date.now()+index}`
        );
        
        setUploadedImages([...uploadedImages, ...newImages]);
        
        toast({
          title: "Images Uploaded",
          description: `${e.target.files?.length} images have been uploaded.`,
        });
      }, 2000);
    }
  };
  
  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Images</h3>
      
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
        <input
          type="file"
          id="property-images"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={isLoading}
        />
        
        <label
          htmlFor="property-images"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-lg font-medium">Drop your images here or click to browse</span>
          <span className="text-sm text-gray-500 mt-1">Support: JPG, PNG, WEBP (Max 5MB each)</span>
        </label>
        
        {isLoading && uploadProgress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-naija-primary h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-sm mt-2">Uploading... {uploadProgress}%</span>
          </div>
        )}
      </div>
      
      {uploadedImages.length > 0 && (
        <div>
          <Label className="mb-2 block">Uploaded Images</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="h-24 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImages;
