
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader, PencilIcon, Plus, Trash } from "lucide-react";
import PropertySelector from "@/components/investments/PropertySelector";

const investmentPropertySchema = z.object({
  property_id: z.string({
    required_error: "Please select a property",
  }),
  initial_value: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Initial value must be a positive number",
  }),
  current_value: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Current value must be a positive number",
  }),
  appreciation_model: z.enum(["fixed", "manual"]),
  appreciation_rate: z.string().optional(),
});

const updateValueSchema = z.object({
  current_value: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Current value must be a positive number",
  }),
});

const AdminInvestments = () => {
  const { user, userType } = useAuth();
  const [loading, setLoading] = useState(true);
  const [investmentProperties, setInvestmentProperties] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const form = useForm<z.infer<typeof investmentPropertySchema>>({
    resolver: zodResolver(investmentPropertySchema),
    defaultValues: {
      property_id: "",
      initial_value: "",
      current_value: "",
      appreciation_model: "fixed",
      appreciation_rate: "5",
    },
  });

  const updateForm = useForm<z.infer<typeof updateValueSchema>>({
    resolver: zodResolver(updateValueSchema),
    defaultValues: {
      current_value: "",
    },
  });

  const watchAppreciationModel = form.watch("appreciation_model");

  useEffect(() => {
    if (user) {
      fetchInvestmentProperties();
    }
  }, [user]);

  const fetchInvestmentProperties = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('investment_properties')
        .select(`
          *,
          property:properties(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setInvestmentProperties(data || []);
    } catch (error: any) {
      toast.error("Failed to load investment properties", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvestmentProperty = async (data: z.infer<typeof investmentPropertySchema>) => {
    if (!user || userType !== 'admin') {
      toast.error("You don't have permission to perform this action");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newInvestmentProperty = {
        property_id: parseInt(data.property_id),
        initial_value: parseFloat(data.initial_value),
        current_value: parseFloat(data.current_value),
        appreciation_model: data.appreciation_model,
        appreciation_rate: data.appreciation_model === 'fixed' ? parseFloat(data.appreciation_rate || "0") : null,
      };
      
      const { data: createdProperty, error } = await supabase
        .from('investment_properties')
        .insert([newInvestmentProperty])
        .select();
      
      if (error) throw error;
      
      toast.success("Investment property created successfully");
      setIsAddDialogOpen(false);
      fetchInvestmentProperties();
      
      // Reset form
      form.reset({
        property_id: "",
        initial_value: "",
        current_value: "",
        appreciation_model: "fixed",
        appreciation_rate: "5",
      });
    } catch (error: any) {
      toast.error("Failed to create investment property", {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateValue = async (data: z.infer<typeof updateValueSchema>) => {
    if (!selectedProperty || userType !== 'admin') return;

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('investment_properties')
        .update({ 
          current_value: parseFloat(data.current_value),
          last_update_date: new Date().toISOString()
        })
        .eq('id', selectedProperty.id);
      
      if (error) throw error;
      
      toast.success("Property value updated successfully");
      setIsUpdateDialogOpen(false);
      fetchInvestmentProperties();
      
      // Reset form
      updateForm.reset();
    } catch (error: any) {
      toast.error("Failed to update property value", {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInvestmentProperty = async (id: number) => {
    if (!confirm("Are you sure you want to delete this investment property? This will also delete all associated investments.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('investment_properties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Investment property deleted successfully");
      fetchInvestmentProperties();
    } catch (error: any) {
      toast.error("Failed to delete investment property", {
        description: error.message
      });
    }
  };

  const openUpdateDialog = (property: any) => {
    setSelectedProperty(property);
    updateForm.setValue("current_value", property.current_value.toString());
    setIsUpdateDialogOpen(true);
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (userType !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Investment Properties</h1>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-naija-primary hover:bg-naija-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Investment Property
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 animate-spin text-naija-primary mr-2" />
            <span>Loading investment properties...</span>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Initial Value</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Appreciation Model</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investmentProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No investment properties found
                    </TableCell>
                  </TableRow>
                ) : (
                  investmentProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            <img 
                              src={property.property?.image || "https://placehold.co/600x400?text=Property"} 
                              alt={property.property?.title} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{property.property?.title}</p>
                            <p className="text-xs text-gray-500">{property.property?.location}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(property.initial_value)}</TableCell>
                      <TableCell>{formatCurrency(property.current_value)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="capitalize">{property.appreciation_model}</span>
                          {property.appreciation_model === 'fixed' && property.appreciation_rate && (
                            <span className="text-xs text-green-600">{property.appreciation_rate}% rate</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(property.last_update_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openUpdateDialog(property)}
                          className="mr-2"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteInvestmentProperty(property.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Add Investment Property Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Investment Property</DialogTitle>
              <DialogDescription>
                Create a new investment property from an existing listing
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateInvestmentProperty)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="property_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Property</FormLabel>
                      <PropertySelector 
                        value={field.value} 
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="initial_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Value (₦)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 10000000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="current_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Value (₦)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 10000000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="appreciation_model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appreciation Model</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select appreciation model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="fixed">Fixed Percentage</SelectItem>
                            <SelectItem value="manual">Manual Updates</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {watchAppreciationModel === 'fixed' 
                          ? 'Property value increases by a fixed percentage quarterly' 
                          : 'Property value will need to be updated manually'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchAppreciationModel === 'fixed' && (
                  <FormField
                    control={form.control}
                    name="appreciation_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appreciation Rate (%)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 5" {...field} />
                        </FormControl>
                        <FormDescription>
                          Quarterly appreciation percentage
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    className="bg-naija-primary hover:bg-naija-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Creating
                      </>
                    ) : (
                      'Create Investment Property'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Update Value Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Property Value</DialogTitle>
              <DialogDescription>
                {selectedProperty?.property?.title}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit(handleUpdateValue)} className="space-y-4">
                <FormField
                  control={updateForm.control}
                  name="current_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Value (₦)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 10000000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Previous value: {selectedProperty && formatCurrency(selectedProperty.current_value)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    className="bg-naija-primary hover:bg-naija-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Updating
                      </>
                    ) : (
                      'Update Value'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminInvestments;
