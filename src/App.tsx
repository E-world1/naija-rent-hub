
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import AddProperty from "./pages/AddProperty";
import MyListings from "./pages/MyListings";
import Agents from "./pages/Agents";
import About from "./pages/About";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/add-property" element={
              <ProtectedRoute requiredUserType="agent">
                <AddProperty />
              </ProtectedRoute>
            } />
            <Route path="/my-listings" element={
              <ProtectedRoute requiredUserType="agent">
                <MyListings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
