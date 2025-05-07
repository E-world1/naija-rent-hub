
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { MapProvider } from "@/components/maps/MapProvider";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <MapProvider>
        <main className="flex-grow">{children}</main>
      </MapProvider>
      <Footer />
    </div>
  );
};

export default Layout;
