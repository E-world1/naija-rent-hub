
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

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
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleUserTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      userType: value,
    }));
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await signUp(formData.email, formData.password, {
        fullName: formData.fullName,
        phone: formData.phone,
        userType: formData.userType,
      });
    } catch (error: any) {
      toast.error("Failed to create account", { 
        description: error.message || "An unexpected error occurred" 
      });
    }
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
          className={formErrors.fullName ? "border-red-500" : ""}
        />
        {formErrors.fullName && (
          <p className="text-sm text-red-500">{formErrors.fullName}</p>
        )}
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
          className={formErrors.email ? "border-red-500" : ""}
        />
        {formErrors.email && (
          <p className="text-sm text-red-500">{formErrors.email}</p>
        )}
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
          className={formErrors.phone ? "border-red-500" : ""}
        />
        {formErrors.phone && (
          <p className="text-sm text-red-500">{formErrors.phone}</p>
        )}
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
          className={formErrors.password ? "border-red-500" : ""}
        />
        {formErrors.password && (
          <p className="text-sm text-red-500">{formErrors.password}</p>
        )}
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
          className={formErrors.confirmPassword ? "border-red-500" : ""}
        />
        {formErrors.confirmPassword && (
          <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
        )}
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
