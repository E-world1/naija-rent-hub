
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { playSound } from "@/utils/soundEffects";

interface CallButtonProps {
  recipientName: string;
  recipientId: string;
}

const CallButton = ({ recipientName, recipientId }: CallButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const { toast } = useToast();

  const handleStartCall = () => {
    setIsCallActive(true);
    // Play call sound effect
    playSound('call');
    
    toast({
      title: "Call started",
      description: `Connected with ${recipientName}`,
    });
    
    // Start call timer
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    // Store interval ID to clear it later
    window.callTimerId = interval;
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    // Play hangup sound effect
    playSound('hangup');
    
    if (window.callTimerId) {
      clearInterval(window.callTimerId);
    }
    
    toast({
      title: "Call ended",
      description: `Call duration: ${formatDuration(callDuration)}`,
    });
    setCallDuration(0);
    setIsDialogOpen(false);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        className="bg-green-600 hover:bg-green-700" 
        size="sm"
      >
        <Phone className="h-4 w-4 mr-2" />
        Call
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isCallActive ? `In call with ${recipientName}` : `Call ${recipientName}`}
            </DialogTitle>
            <DialogDescription>
              {isCallActive 
                ? `Call duration: ${formatDuration(callDuration)}`
                : "Start a voice call with this contact"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-xl font-medium">{recipientName.charAt(0)}</span>
            </div>
            
            {isCallActive ? (
              <Button 
                variant="destructive"
                onClick={handleEndCall}
                className="rounded-full w-16 h-16 mt-4"
              >
                <Phone className="h-6 w-6" />
              </Button>
            ) : (
              <Button 
                onClick={handleStartCall}
                className="bg-green-600 hover:bg-green-700 rounded-full w-16 h-16 mt-4"
              >
                <Phone className="h-6 w-6" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CallButton;
