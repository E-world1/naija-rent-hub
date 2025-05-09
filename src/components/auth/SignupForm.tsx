
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "renter",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      userType: value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    await signUp(formData.email, formData.password, {
      fullName: formData.fullName,
      phone: formData.phone,
      userType: formData.userType,
    });
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="080XXXXXXXX"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>I want to:</Label>
        <RadioGroup 
          defaultValue={formData.userType} 
          onValueChange={handleUserTypeChange}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="renter" id="renter" />
            <Label htmlFor="renter">Rent a property (I'm a tenant)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="agent" id="agent" />
            <Label htmlFor="agent">List properties (I'm an agent/landlord)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-naija-primary hover:bg-naija-primary/90"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </span>
        ) : (
          "Create Account"
        )}
      </Button>
      
      <div className="text-center text-sm text-gray-500">
        By signing up, you agree to our{" "}
        <Link to="/terms" className="text-naija-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-naija-primary hover:underline">
          Privacy Policy
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
