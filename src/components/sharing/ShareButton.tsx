
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface ShareButtonProps {
  title?: string;
  description?: string;
  url?: string;
}

const ShareButton = ({
  title = "Check out NaijaRentHub!",
  description = "I found this amazing property rental platform in Nigeria. Check it out!",
  url = window.location.href
}: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareData = {
    title,
    text: description,
    url,
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Thanks for sharing!");
      } else {
        // Fallback for browsers that don't support native sharing
        toast.info("Please use the social media buttons to share");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const socialPlatforms = [
    {
      name: "WhatsApp",
      icon: <span className="text-green-600 text-xl">📱</span>,
      shareUrl: `https://wa.me/?text=${encodeURIComponent(`${title} - ${description} ${url}`)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="text-blue-600" />,
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(description)}`,
    },
    {
      name: "Twitter",
      icon: <Twitter className="text-blue-400" />,
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${description} ${url}`)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="text-blue-700" />,
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "Instagram",
      icon: <Instagram className="text-pink-500" />,
      // Instagram doesn't have a direct sharing URL, typically just opens the app
      shareUrl: `https://www.instagram.com/`,
    },
  ];

  const handleSocialShare = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400");
    setIsOpen(false);
    toast.success("Thanks for sharing!");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex gap-2 border-naija-primary text-naija-primary hover:bg-naija-primary hover:text-white"
        >
          <Share size={16} />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Share your experience</h4>
          <div className="flex flex-wrap gap-2 justify-around">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleSocialShare(platform.shareUrl)}
                className="flex flex-col items-center p-2 rounded hover:bg-gray-100 transition-colors"
                aria-label={`Share on ${platform.name}`}
              >
                {platform.icon}
                <span className="text-xs mt-1">{platform.name}</span>
              </button>
            ))}
          </div>
          
          {navigator.share && (
            <Button 
              variant="default" 
              className="w-full mt-2 bg-naija-primary hover:bg-naija-primary/90"
              onClick={handleNativeShare}
            >
              Share via device
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
