
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import BSRTrendChart from "@/components/BSRTrendChart";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductGridProps {
  filters: any;
  onProductSelect: (product: any) => void;
}

// Mock product data
const mockProducts = [
  {
    id: "1",
    title: "Wireless Bluetooth Headphones - Premium Sound Quality",
    image: "/placeholder.svg",
    price: 89.99,
    amazonPrice: 129.99,
    bsr: 45000,
    profit: 15.20,
    margin: 32,
    category: "Electronics",
    asin: "B08XYZ123"
  },
  {
    id: "2", 
    title: "Kitchen Knife Set - Professional Grade Stainless Steel",
    image: "/placeholder.svg",
    price: 45.99,
    amazonPrice: 67.99,
    bsr: 120000,
    profit: 8.50,
    margin: 24,
    category: "Home & Kitchen",
    asin: "B09ABC456"
  },
  {
    id: "3",
    title: "Educational STEM Building Blocks Set for Kids",
    image: "/placeholder.svg",
    price: 32.99,
    amazonPrice: 49.99,
    bsr: 89000,
    profit: 12.30,
    margin: 28,
    category: "Toys & Games",
    asin: "B07DEF789"
  },
  {
    id: "4",
    title: "Yoga Mat - Extra Thick Non-Slip Exercise Mat",
    image: "/placeholder.svg",
    price: 24.99,
    amazonPrice: 39.99,
    bsr: 67000,
    profit: 9.75,
    margin: 31,
    category: "Sports & Outdoors",
    asin: "B06GHI012"
  }
];

const ProductGrid = ({ filters, onProductSelect }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showBSRChart, setShowBSRChart] = useState(false);

  const handleViewBSR = (product: any) => {
    setSelectedProduct(product);
    setShowBSRChart(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Product Opportunities</h2>
          <p className="text-gray-600">{mockProducts.length} products found matching your criteria</p>
        </div>
        <div className="flex gap-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>Sort by Profit</option>
            <option>Sort by Margin</option>
            <option>Sort by BSR</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onProductSelect}
            onViewBSR={() => handleViewBSR(product)}
          />
        ))}
      </div>

      {/* BSR Trend Modal */}
      <Dialog open={showBSRChart} onOpenChange={setShowBSRChart}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>BSR Trend Analysis - {selectedProduct?.title}</DialogTitle>
          </DialogHeader>
          {selectedProduct && <BSRTrendChart product={selectedProduct} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGrid;
