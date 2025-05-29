
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFilters } from "@/services/productService";

interface FilterSidebarProps {
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
}

const FilterSidebar = ({ filters, setFilters }: FilterSidebarProps) => {
  const categories = [
    "All Categories",
    "Electronics", 
    "Home & Kitchen",
    "Toys & Games",
    "Sports & Outdoors",
    "Books",
    "Clothing",
    "Health & Personal Care"
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Search Filters</h2>
      
      {/* Category Filter */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3">Category</h3>
        <Select 
          value={filters.category || ""} 
          onValueChange={(value) => setFilters({...filters, category: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* BSR Filter */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3">Best Seller Rank (BSR)</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Max BSR</span>
            <span>{(filters.maxBSR || 0).toLocaleString()}</span>
          </div>
          <Slider
            value={[filters.maxBSR || 300000]}
            onValueChange={([value]) => setFilters({...filters, maxBSR: value})}
            max={500000}
            min={1000}
            step={10000}
            className="w-full"
          />
        </div>
      </Card>

      {/* Profit Filter */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3">Minimum Profit</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Min Profit</span>
            <span>${filters.minProfit || 0}</span>
          </div>
          <Slider
            value={[filters.minProfit || 7]}
            onValueChange={([value]) => setFilters({...filters, minProfit: value})}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
      </Card>

      {/* Margin Filter */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3">Minimum Margin</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Min Margin</span>
            <span>{filters.minMargin || 0}%</span>
          </div>
          <Slider
            value={[filters.minMargin || 20]}
            onValueChange={([value]) => setFilters({...filters, minMargin: value})}
            max={100}
            min={5}
            step={5}
            className="w-full"
          />
        </div>
      </Card>

      {/* Price Range */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange?.[0] || 0}</span>
            <span>${filters.priceRange?.[1] || 1000}</span>
          </div>
          <Slider
            value={filters.priceRange || [0, 1000]}
            onValueChange={(value) => setFilters({...filters, priceRange: [value[0], value[1]]})}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
        </div>
      </Card>

      {/* Apply Filters Button */}
      <button className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
