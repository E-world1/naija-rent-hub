
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"renter" | "agent">("renter");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock login success
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userType === "agent" ? "Agent" : "Renter"}!`,
      });
      
      navigate("/");
    }, 1500);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="/forgot-password" className="text-sm text-naija-primary hover:underline">
            Forgot your password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>I am a:</Label>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="renter" 
              checked={userType === "renter"}
              onCheckedChange={() => setUserType("renter")}
            />
            <label
              htmlFor="renter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Renter
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="agent" 
              checked={userType === "agent"}
              onCheckedChange={() => setUserType("agent")}
            />
            <label
              htmlFor="agent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Agent/Landlord
            </label>
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-naija-primary hover:bg-naija-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        Don't have an account?{" "}
        <a href="#" className="text-naija-primary hover:underline">
          Sign up now
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
