import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, User, Menu, X, MessageSquare, TrendingUp } from "lucide-react";
import ShareButton from "@/components/sharing/ShareButton";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { user, userType, signOut } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-naija-primary font-bold text-xl">NaijaRentHub</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/" className="px-3 py-2 text-gray-700 hover:text-naija-primary">
                Home
              </Link>
              <Link to="/properties" className="px-3 py-2 text-gray-700 hover:text-naija-primary">
                Properties
              </Link>
              <Link to="/agents" className="px-3 py-2 text-gray-700 hover:text-naija-primary">
                Agents
              </Link>
              {user && (
                <Link to="/investments" className="px-3 py-2 text-gray-700 hover:text-naija-primary flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Investments
                </Link>
              )}
              <Link to="/about" className="px-3 py-2 text-gray-700 hover:text-naija-primary">
                About
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/search" className="text-gray-700 hover:text-naija-primary">
              <Search size={20} />
            </Link>
            
            {user && (
              <>
                <Link to="/messages" className="text-gray-700 hover:text-naija-primary">
                  <MessageSquare size={20} />
                </Link>
                <ShareButton />
              </>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  {userType === 'admin' && (
                    <DropdownMenuItem>
                      <Link to="/admin/investments" className="w-full">Manage Investments</Link>
                    </DropdownMenuItem>
                  )}
                  {userType === 'agent' && (
                    <DropdownMenuItem>
                      <Link to="/my-listings" className="w-full">My Listings</Link>
                    </DropdownMenuItem>
                  )}
                  {userType === 'renter' && (
                    <DropdownMenuItem>
                      <Link to="/saved-properties" className="w-full">Saved Properties</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost">
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" className="bg-naija-primary hover:bg-naija-primary/90">
                  <Link to="/signup" className="text-white">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-naija-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/properties"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary"
              onClick={() => setIsOpen(false)}
            >
              Properties
            </Link>
            <Link
              to="/agents"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary"
              onClick={() => setIsOpen(false)}
            >
              Agents
            </Link>
            {user && (
              <Link
                to="/investments"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Investments
              </Link>
            )}
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            
            {user && (
              <Link
                to="/messages"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary"
                onClick={() => setIsOpen(false)}
              >
                Messages
              </Link>
            )}
            
            {user && (
              <div className="flex justify-center py-2">
                <ShareButton />
              </div>
            )}
            
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                {userType === 'admin' && (
                  <Link
                    to="/admin/investments"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Manage Investments
                  </Link>
                )}
                {userType === 'agent' && (
                  <Link
                    to="/my-listings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    My Listings
                  </Link>
                )}
                {userType === 'renter' && (
                  <Link
                    to="/saved-properties"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Saved Properties
                  </Link>
                )}
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary"
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-naija-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-naija-primary text-white hover:bg-naija-primary/90"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
