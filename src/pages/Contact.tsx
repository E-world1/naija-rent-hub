
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill all fields", {
        description: "All fields are required to submit your message."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulating the sending of a message - in a real app, you would call an API
    setTimeout(() => {
      toast.success("Message Sent", {
        description: "Thank you for your message. We'll get back to you soon!"
      });
      setFormData({
        name: "",
        email: user?.email || "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-naija-accent rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-naija-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+234 800 123 4567</p>
              <p className="text-gray-600">+234 900 876 5432</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-naija-accent rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-naija-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600">info@naijarenthub.com</p>
              <p className="text-gray-600">support@naijarenthub.com</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-naija-accent rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-naija-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-gray-600">Plot 123, Victoria Island</p>
              <p className="text-gray-600">Lagos, Nigeria</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message here"
                  rows={6}
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-naija-primary hover:bg-naija-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
