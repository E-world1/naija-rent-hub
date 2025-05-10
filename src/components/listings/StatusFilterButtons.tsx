
import { Button } from "@/components/ui/button";

interface StatusFilterButtonsProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const StatusFilterButtons = ({ currentFilter, onFilterChange }: StatusFilterButtonsProps) => {
  return (
    <div className="mb-6">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={currentFilter === "all" ? "default" : "outline"}
          onClick={() => onFilterChange("all")}
          className={currentFilter === "all" ? "bg-naija-primary" : ""}
        >
          All
        </Button>
        <Button
          variant={currentFilter === "active" ? "default" : "outline"}
          onClick={() => onFilterChange("active")}
          className={currentFilter === "active" ? "bg-green-500" : ""}
        >
          Active
        </Button>
        <Button
          variant={currentFilter === "inactive" ? "default" : "outline"}
          onClick={() => onFilterChange("inactive")}
          className={currentFilter === "inactive" ? "bg-gray-500" : ""}
        >
          Inactive
        </Button>
        <Button
          variant={currentFilter === "rented" ? "default" : "outline"}
          onClick={() => onFilterChange("rented")}
          className={currentFilter === "rented" ? "bg-blue-500" : ""}
        >
          Rented
        </Button>
      </div>
    </div>
  );
};

export default StatusFilterButtons;
