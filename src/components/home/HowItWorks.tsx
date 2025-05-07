
import { Building, User, CreditCard, Check } from "lucide-react";

const steps = [
  {
    icon: <User className="h-10 w-10 text-naija-primary" />,
    title: "Create an Account",
    description: "Sign up as a landlord, agent, or tenant with a simple registration process."
  },
  {
    icon: <Building className="h-10 w-10 text-naija-primary" />,
    title: "List or Find Properties",
    description: "List your property or search for available properties in your desired location."
  },
  {
    icon: <CreditCard className="h-10 w-10 text-naija-primary" />,
    title: "Secure Payment",
    description: "Make secure payments through our integrated Paystack payment gateway."
  },
  {
    icon: <Check className="h-10 w-10 text-naija-primary" />,
    title: "Move In",
    description: "Complete the rental agreement and move into your new home."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-naija-dark mb-3">How NaijaRentHub Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've simplified the rental process to help you find your perfect home or list your property with ease.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-naija-accent rounded-full p-5 mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
