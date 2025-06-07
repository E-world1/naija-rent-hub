
import { Button } from "@/components/ui/button";

interface StatusFilterButtonsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const StatusFilterButtons = ({ activeFilter, onFilterChange }: StatusFilterButtonsProps) => {
  return (
    <div className="mb-6">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          onClick={() => onFilterChange("all")}
          className={activeFilter === "all" ? "bg-naija-primary" : ""}
        >
          All
        </Button>
        <Button
          variant={activeFilter === "active" ? "default" : "outline"}
          onClick={() => onFilterChange("active")}
          className={activeFilter === "active" ? "bg-green-500" : ""}
        >
          Active
        </Button>
        <Button
          variant={activeFilter === "inactive" ? "default" : "outline"}
          onClick={() => onFilterChange("inactive")}
          className={activeFilter === "inactive" ? "bg-gray-500" : ""}
        >
          Inactive
        </Button>
        <Button
          variant={activeFilter === "rented" ? "default" : "outline"}
          onClick={() => onFilterChange("rented")}
          className={activeFilter === "rented" ? "bg-blue-500" : ""}
        >
          Rented
        </Button>
      </div>
    </div>
  );
};

export default StatusFilterButtons;
