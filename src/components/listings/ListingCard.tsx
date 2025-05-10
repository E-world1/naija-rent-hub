
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash, Eye, MapPin, Bed } from "lucide-react";

export interface Property {
  id: number;
  title: string;
  price: string;
  period: string;
  image: string;
  bedrooms: number;
  status: string;
  views?: number;
  created_at: string;
  state: string;
  lga: string;
  area?: string;
}

interface ListingCardProps {
  property: Property;
  onDelete: (id: number) => Promise<void>;
  onStatusUpdate: (id: number, status: string) => Promise<void>;
}

const ListingCard = ({ property, onDelete, onStatusUpdate }: ListingCardProps) => {
  // Format location string from state, lga, area
  const formatLocation = () => {
    const parts = [
      property.area,
      property.lga,
      property.state
    ].filter(Boolean);
    return parts.join(', ');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "rented":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 h-48 md:h-auto">
            <img 
              src={property.image} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-3/4 p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold">{property.title}</h3>
                  <Badge className={`ml-2 ${getStatusColor(property.status)}`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{formatLocation()}</span>
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="text-xl font-bold text-naija-dark">{property.price}</span>
                <span className="text-gray-500 ml-1 text-sm">/ {property.period}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 my-4">
              <div className="flex items-center">
                <Bed className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm">{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm">{property.views || 0} Views</span>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6m-6 0v10a2 2 0 002 2h2a2 2 0 002-2V7" />
                </svg>
                <span className="text-sm">Listed on {new Date(property.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Link to={`/property/${property.id}`} className="flex items-center">
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Link to={`/edit-property/${property.id}`} className="flex items-center">
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                      <Trash className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this property listing. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(property.id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onStatusUpdate(property.id, "active")}>
                    Mark as Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusUpdate(property.id, "inactive")}>
                    Mark as Inactive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusUpdate(property.id, "rented")}>
                    Mark as Rented
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;
