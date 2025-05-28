
import { useState } from "react";
import Header from "@/components/Header";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import ProfitCalculator from "@/components/ProfitCalculator";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    maxBSR: 300000,
    minProfit: 7,
    minMargin: 20,
    priceRange: [0, 1000]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="flex">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        
        <main className="flex-1 p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-green-100">Products Found</div>
            </Card>
            <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="text-2xl font-bold">$12.50</div>
              <div className="text-blue-100">Avg Profit</div>
            </Card>
            <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="text-2xl font-bold">28%</div>
              <div className="text-purple-100">Avg Margin</div>
            </Card>
            <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="text-2xl font-bold">142K</div>
              <div className="text-orange-100">Avg BSR</div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setShowCalculator(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Profit Calculator
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Export Results
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors">
              Save Search
            </button>
          </div>

          {/* Product Grid */}
          <ProductGrid 
            filters={filters} 
            onProductSelect={setSelectedProduct}
          />
        </main>
      </div>

      {/* Profit Calculator Modal */}
      {showCalculator && (
        <ProfitCalculator 
          onClose={() => setShowCalculator(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Index;
