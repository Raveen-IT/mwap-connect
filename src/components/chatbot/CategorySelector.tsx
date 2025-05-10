
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, MessageSquare, HelpCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Scheme {
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
}

interface SchemeCategory {
  id: string;
  name: string;
  icon: JSX.Element;
  schemes: Scheme[];
}

interface CategorySelectorProps {
  categories: SchemeCategory[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  onSchemeSelect: (scheme: Scheme) => void;
  rights: string[];
}

const CategorySelector = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  onSchemeSelect,
  rights
}: CategorySelectorProps) => {
  return (
    <div className="border-r hidden md:block bg-background/50">
      <div className="p-4 h-full">
        <h3 className="font-semibold mb-4 text-sm text-primary">Select a Category</h3>
        <RadioGroup value={selectedCategory || ""} onValueChange={setSelectedCategory} className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <RadioGroupItem value={category.id} id={category.id} />
              <label htmlFor={category.id} className="flex items-center cursor-pointer">
                {category.icon}
                <span className="ml-2 text-sm">{category.name}</span>
              </label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rights" id="rights" />
            <label htmlFor="rights" className="flex items-center cursor-pointer">
              <Info className="h-5 w-5 text-red-500" />
              <span className="ml-2 text-sm">Legal Rights</span>
            </label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default CategorySelector;
